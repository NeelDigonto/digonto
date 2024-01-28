import React from "react";
import Image from "next/image";

interface BadgeProps {
  src: string;
  text: string;
}

const Badge: React.FC<BadgeProps> = (props) => {
  return (
    <div className="badgeContainer">
      <Image src={props.src} width={24} height={24} alt={props.text} />
      {props.text}
    </div>
  );
};

export default Badge;
