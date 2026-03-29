"use client";
import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function QuizSubjectRedirect() {
  const router = useRouter();
  const params = useParams();
  const subject = typeof params.subject === "string" ? params.subject : "";
  useEffect(() => { router.push(`/study/rpl/${subject}`); }, [router, subject]);
  return null;
}
