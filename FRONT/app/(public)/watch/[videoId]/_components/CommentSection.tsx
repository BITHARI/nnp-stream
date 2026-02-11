'use client'

import { useState } from "react";
import dayjs from "dayjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import relativeTime from "dayjs/plugin/relativeTime";
import { createComment, getComments } from "@/services/video";
import { showError } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

dayjs.extend(relativeTime);

interface CommentSectionProps {
    videoId: string;
}

export default function CommentSection({ videoId }: CommentSectionProps) {
    const [newComment, setNewComment] = useState("")
    const queryClient = useQueryClient();
    const { mutateAsync, isPending } = useMutation({
        mutationFn: createComment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["comments", videoId] });
        },
    })
    const { data } = useQuery({
        queryKey: ["comments", videoId],
        queryFn: () => getComments(videoId),
        enabled: !!videoId,
    });

    const comments = data?.comments || [];

    const handleSubmitComment = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await mutateAsync({ content: newComment, videoId });
            setNewComment("");
        } catch (error) {
            showError(error);
        }
    };

    return (
        <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg">{"Commentaires"}</h3>
            <div className="space-y-3">
                {comments.map((comment) => (
                    <div key={comment.id} className="bg-nnp-primary-dark/30 backdrop-blur-sm rounded-lg p-2">
                        <div className="flex items-start gap-3">
                            <Avatar>
                                <AvatarImage src={comment.author.image} alt="Profile image" />
                                <AvatarFallback className="flex items-center justify-center text-center">{comment.author?.name?.split(' ').slice(0, 2).map((name: string) => name.charAt(0)).join('')}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-white">{comment.author.name}</span>
                                    <span className="text-sm text-gray-400">{dayjs(comment.created_at).fromNow()}</span>
                                </div>
                                <p className="text-sm text-gray-200">{comment.content}</p>
                            </div>
                        </div>
                    </div>
                ))}
                <form onSubmit={handleSubmitComment} className="space-y-2">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder={"Saisissez votre commentaire ici..."}
                        className="w-full min-h-[30px] p-2 rounded-lg bg-nnp-primary-dark/50 backdrop-blur-sm
                   text-white placeholder-gray-400 border border-gray-700 focus:border-nnp-highlight
                   focus:ring-1 focus:ring-nnp-highlight outline-none transition-all"
                    />
                    <Button
                        type="submit"
                        loading={isPending}
                        disabled={!newComment.trim()}
                    >
                        {"Publier le commentaire"}
                    </Button>
                </form>
            </div>
        </div>
    );
}
