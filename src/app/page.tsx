import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <p>Welcome to my drone site!</p>
        <p>Here you can find all the infos on my drone!</p>
        <div>
          <div id="tile1">
            <a href="">
              <Image src="/images/drone.jpg" alt="Drone" width={150} height={150} />
              <p>Drone Haftpflichtversicherung</p>
            </a>
          </div>
          <div id="tile2">
            <a href="">
              <Image src="/images/drone.jpg" alt="Drone" width={150} height={150} />
              <p>Drone Haftpflichtversicherung</p>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
