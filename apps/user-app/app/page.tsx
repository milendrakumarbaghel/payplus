import Image, { type ImageProps } from "next/image";
import { Button } from "@repo/ui/button";
import styles from "./page.module.css";
import { PrismaClient } from "@repo/db/client";
const client = new PrismaClient();

export default function Home() {
  return (
    <div>
        <h1 className="text-3xl font-bold underline">
          Hello!
        </h1>
    </div>

  );
}
