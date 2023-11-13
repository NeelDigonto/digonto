import React from "react";
import styled from "styled-components";
import Image from "next/image";

interface BadgeProps {
  src: string;
  text: string;
}

const BadgeContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;

  column-gap: 0.75rem;
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;

  width: 9rem;
  min-width: 9rem;
`;

const Badge: React.FC<BadgeProps> = (props) => {
  return (
    <BadgeContainer>
      <Image src={props.src} width={24} height={24} alt={props.text} />
      {props.text}
    </BadgeContainer>
  );
};

export default Badge;
