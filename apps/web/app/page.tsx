import { Suspense } from "react";
import { DemoApp } from "@/components/demo-app";

export default function HomePage() {
  return <Suspense fallback={<div className="loading">AN SINH 360</div>}><DemoApp /></Suspense>;
}
