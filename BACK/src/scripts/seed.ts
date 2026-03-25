import 'dotenv/config';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import * as bcrypt from 'bcryptjs';
import { PrismaClient, UserRole, NoteType } from '@/generated/prisma/client.js';

const db = new PrismaClient();
const __dirname = dirname(fileURLToPath(import.meta.url));

// ─── Types ────────────────────────────────────────────────────────────────────

interface SeedUser {
    email: string;
    password: string;
    name: string;
    userRole: keyof typeof UserRole;
    emailVerified: boolean;
}

interface SeedCategory {
    type: string;
}

interface SeedVideo {
    title: string;
    description: string;
    cover_url: string;
    duration: string;
    type: string;
    slug: string;
    is_promoted: boolean;
    categoryType: string;
}

interface SeedComment {
    videoSlug: string;
    userEmail: string;
    content: string;
}

interface SeedNote {
    videoSlug: string;
    userEmail: string;
    type: keyof typeof NoteType;
}

interface SeedFavorite {
    videoSlug: string;
    userEmail: string;
}

interface SeedData {
    users: SeedUser[];
    categories: SeedCategory[];
    videos: SeedVideo[];
    comments: SeedComment[];
    notes: SeedNote[];
    favorites: SeedFavorite[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function randomUUID(): string {
    return crypto.randomUUID();
}

function log(emoji: string, message: string) {
    console.log(`${emoji}  ${message}`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function seed() {
    /* const existingUsers = await db.user.count();
    if (existingUsers > 0) {
        console.log('⏭️  Base déjà peuplée, seeding ignoré.');
        return;
    } */
    console.log('\n🌱 Démarrage du seeding...\n');

    // Charger le fichier JSON
    const dataPath = resolve(__dirname, 'data.json');
    const raw = readFileSync(dataPath, 'utf-8');
    const data: SeedData = JSON.parse(raw);

    // ── Nettoyage ──────────────────────────────────────────────────────────────
    log('🧹', 'Nettoyage de la base de données...');
    await db.favorite.deleteMany();
    await db.note.deleteMany();
    await db.comment.deleteMany();
    await db.video.deleteMany();
    await db.category.deleteMany();
    await db.user.deleteMany();
    log('✅', 'Base nettoyée\n');

    // ── Utilisateurs ───────────────────────────────────────────────────────────
    log('👤', `Création de ${data.users.length} utilisateurs...`);
    const userMap = new Map<string, string>(); // email → id

    for (const u of data.users) {
        const hashedPassword = await bcrypt.hash(u.password, 12);
        const user = await db.user.create({
            data: {
                email: u.email,
                password: hashedPassword,
                name: u.name,
                userRole: UserRole[u.userRole],
                emailVerified: u.emailVerified,
            },
        });
        userMap.set(user.email, user.id);
        log('  ✓', `${user.name} (${user.userRole})`);
    }

    // ── Catégories ─────────────────────────────────────────────────────────────
    log('\n📂', `Création de ${data.categories.length} catégories...`);
    const categoryMap = new Map<string, string>(); // type → id

    for (const c of data.categories) {
        const category = await db.category.create({ data: { type: c.type } });
        categoryMap.set(category.type, category.id);
        log('  ✓', category.type);
    }

    // ── Vidéos ─────────────────────────────────────────────────────────────────
    log('\n🎬', `Création de ${data.videos.length} vidéos...`);
    const videoMap = new Map<string, string>(); // slug → id

    // On assigne les auteurs en round-robin sur les users ADMIN / SUPERADMIN
    const authorIds = data.users
        .filter((u) => u.userRole === 'ADMIN' || u.userRole === 'SUPERADMIN')
        .map((u) => userMap.get(u.email)!);

    for (let i = 0; i < data.videos.length; i++) {
        const v = data.videos[i];
        const categoryId = categoryMap.get(v.categoryType);

        if (!categoryId) {
            throw new Error(`Catégorie introuvable : "${v.categoryType}" pour la vidéo "${v.title}"`);
        }

        const video = await db.video.create({
            data: {
                title: v.title,
                description: v.description,
                cover_url: v.cover_url,
                duration: v.duration,
                type: v.type,
                slug: v.slug,
                is_promoted: v.is_promoted,
                // Simule des identifiants Mux avec des UUIDs
                mux_asset_id: randomUUID(),
                playback_id: randomUUID(),
                category_id: categoryId,
                author_id: authorIds[i % authorIds.length],
            },
        });

        videoMap.set(video.slug, video.id);
        log('  ✓', `[${v.categoryType}] ${v.title}`);
    }

    // ── Commentaires ───────────────────────────────────────────────────────────
    log('\n💬', `Création de ${data.comments.length} commentaires...`);

    for (const c of data.comments) {
        const videoId = videoMap.get(c.videoSlug);
        const userId = userMap.get(c.userEmail);

        if (!videoId) throw new Error(`Vidéo introuvable : "${c.videoSlug}"`);
        if (!userId) throw new Error(`Utilisateur introuvable : "${c.userEmail}"`);

        await db.comment.create({
            data: {
                content: c.content,
                video_id: videoId,
                author_id: userId,
            },
        });
        log('  ✓', `${c.userEmail} → ${c.videoSlug}`);
    }

    // ── Notes (likes/dislikes) ─────────────────────────────────────────────────
    log('\n👍', `Création de ${data.notes.length} notes...`);

    for (const n of data.notes) {
        const videoId = videoMap.get(n.videoSlug);
        const userId = userMap.get(n.userEmail);

        if (!videoId) throw new Error(`Vidéo introuvable : "${n.videoSlug}"`);
        if (!userId) throw new Error(`Utilisateur introuvable : "${n.userEmail}"`);

        await db.note.create({
            data: {
                type: NoteType[n.type],
                video_id: videoId,
                user_id: userId,
            },
        });
        log('  ✓', `${n.userEmail} → ${n.type} → ${n.videoSlug}`);
    }

    // ── Favoris ────────────────────────────────────────────────────────────────
    log('\n⭐', `Création de ${data.favorites.length} favoris...`);

    for (const f of data.favorites) {
        const videoId = videoMap.get(f.videoSlug);
        const userId = userMap.get(f.userEmail);

        if (!videoId) throw new Error(`Vidéo introuvable : "${f.videoSlug}"`);
        if (!userId) throw new Error(`Utilisateur introuvable : "${f.userEmail}"`);

        await db.favorite.create({
            data: {
                video_id: videoId,
                user_id: userId,
            },
        });
        log('  ✓', `${f.userEmail} → ${f.videoSlug}`);
    }

    // ── Résumé ─────────────────────────────────────────────────────────────────
    console.log('\n─────────────────────────────────────────');
    console.log('🎉 Seeding terminé avec succès !\n');
    console.log(`  👤 Utilisateurs : ${data.users.length}`);
    console.log(`  📂 Catégories   : ${data.categories.length}`);
    console.log(`  🎬 Vidéos       : ${data.videos.length}`);
    console.log(`  💬 Commentaires : ${data.comments.length}`);
    console.log(`  👍 Notes        : ${data.notes.length}`);
    console.log(`  ⭐ Favoris      : ${data.favorites.length}`);
    console.log('─────────────────────────────────────────\n');
}

seed()
    .catch((error) => {
        console.error('\n❌ Erreur durant le seeding :', error);
        process.exit(1);
    })
    .finally(async () => {
        await db.$disconnect();
    });