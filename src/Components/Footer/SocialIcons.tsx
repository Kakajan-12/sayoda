"use client";

import React from "react";
import { FaXTwitter, FaTelegram, FaLinkedin, FaWhatsapp } from "react-icons/fa6";
import { GrInstagram } from "react-icons/gr";
import { FiFacebook } from "react-icons/fi";
import type { SocialLink } from "@/lib/api/contacts";

/**
 * Иконки соцсетей. Вынесены в отдельный клиентский компонент, потому что
 * react-icons тянет за собой клиентский рантайм, а сам футер должен остаться
 * серверным — иначе контакты снова пропадут из HTML.
 */

const ICONS: Record<string, React.ElementType> = {
  telegram: FaTelegram,
  linkedin: FaLinkedin,
  instagram: GrInstagram,
  whatsapp: FaWhatsapp,
  facebook: FiFacebook,
  twitter: FaXTwitter,
};

export default function SocialIcons({ links }: { links: SocialLink[] }) {
  if (!links.length) return null;

  return (
    <div className="flex gap-3 mt-4">
      {links.map((item) => {
        const Icon = ICONS[item.icon?.toLowerCase()];
        if (!Icon) return null;
        return (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={item.icon}
          >
            <Icon style={{ width: "25px", height: "25px" }} />
          </a>
        );
      })}
    </div>
  );
}
