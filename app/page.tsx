import HomeFooter from "@/components/home/HomeFooter";
import HomeClient from "@/components/home/HomeClient";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-start relative overflow-hidden">
      <HomeClient />
      <HomeFooter />
    </div>
  );
}
