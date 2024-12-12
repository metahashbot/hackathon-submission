import Image from "next/image";
import LOGO from "/public/logo.svg";

export function Logo() {
  return (
    <div className="relative h-14 w-14">
      <Image src={LOGO} blurDataURL={LOGO.blurDataURL} alt="Logo" fill />
    </div>
  );
}
