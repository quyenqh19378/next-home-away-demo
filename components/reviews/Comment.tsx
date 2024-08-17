"use client";
import { useState } from "react";
import { Button } from "../ui/button";

function Comment({ comment }: { comment: string }) {
    const [isExpended, setIsExpended] = useState(false);

    const toggleExpended = () => {
        setIsExpended(!isExpended);
    };

    const longComment = comment.length > 130;
    const displayComment =
        longComment && !isExpended ? `${comment.slice(0, 130)}...` : comment;

    return (
        <div>
            <p className='text-sm'>{displayComment}</p>
            {longComment && (
                <Button
                    variant='link'
                    className='pl-0 text-muted-foreground'
                    onClick={toggleExpended}
                >
                    {isExpended ? "Show Less" : "Show More"}
                </Button>
            )}
        </div>
    );
}
export default Comment;
