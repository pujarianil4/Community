"use strict";
import Image from "next/image";
import styles from "./page.module.css";
import "../styles/index.scss";
import Navbar from "@/components/navbar/navbar";
import HomeComponent from "@/components/Home/home";

export default function Home() {
  return (
    <main className='dark'>
      <Navbar />
      <HomeComponent />
    </main>
  );
}
