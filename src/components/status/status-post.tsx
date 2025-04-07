"use client";
import { useUser } from "@/context/user-context";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState, useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Image as ImageIcon, Gift, BarChart2, Smile } from "lucide-react";

import { createPost } from "@/actions/create-post";

const MAX_CHARS = 250;

const FormSchema = z.object({
  reply: z
    .string()
    .min(1, {
      message: "Reply cannot be empty.",
    })
    .max(MAX_CHARS, {
      message: `Reply cannot be longer than ${MAX_CHARS} characters.`,
    }),
});

export default function StatusPost() {
  const { user } = useUser();
  const [charCount, setCharCount] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      reply: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const formData = new FormData();
    formData.append("content", data.reply);

    const success = await createPost(formData, null, user);

    if (success) {
      form.reset();
    }
  };

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [form.watch("reply")]);

  return (
    <Card className="w-full max-w-2xl border-0 shadow-none">
      <CardHeader className="sr-only">Create a new post</CardHeader>
      <CardContent className="px-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback className="bg-muted">
                  {user?.name?.[0] || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-4">
                <FormField
                  control={form.control}
                  name="reply"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="What's happening now?"
                          className="border-1 bg-transparent px-3 text-lg focus-visible:ring-0 resize-none overflow-hidden"
                          {...field}
                          ref={textareaRef}
                          onChange={(e) => {
                            field.onChange(e);
                            setCharCount(e.target.value.length);
                          }}
                          maxLength={MAX_CHARS}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="flex items-center justify-between">
                  <div className="flex gap-2 text-indigo-500">
                    <Button
                      variant="ghost"
                      className="rounded-full p-2 hover:bg-indigo-50"
                    >
                      <ImageIcon className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      className="rounded-full p-2 hover:bg-indigo-50"
                    >
                      <Gift className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      className="rounded-full p-2 hover:bg-indigo-50"
                    >
                      <BarChart2 className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      className="rounded-full p-2 hover:bg-indigo-50"
                    >
                      <Smile className="h-5 w-5" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-4">
                    <span
                      className={`text-sm ${charCount > MAX_CHARS ? "text-red-500" : "text-muted-foreground"}`}
                    >
                      {charCount}/{MAX_CHARS}
                    </span>
                    <Button
                      type="submit"
                      className="rounded-full px-4 bg-indigo-500 hover:bg-indigo-600 text-white"
                      variant="secondary"
                      disabled={charCount === 0 || charCount > MAX_CHARS}
                    >
                      Post
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
