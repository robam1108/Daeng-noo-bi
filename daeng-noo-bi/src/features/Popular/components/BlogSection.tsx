// src/components/BlogSection.tsx
import React, { useRef } from "react";
import "./BlogSection.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faUser, faCalendar } from "@fortawesome/free-regular-svg-icons";

interface BlogPost {
  title: string;
  url: string;
  blogname: string;
  datetime: string;
  thumbnail?: string;
}

interface Props {
  places: { contentid: string; title: string }[];
  blogs: Record<string, BlogPost[]>;
}

export default function BlogSection({ places, blogs }: Props) {
  return (
    <section aria-label="인기 장소 블로그 모음" className="blog-section">
      <h2>
        후기 속에 담긴 생생한 이야기, <br className="mobile-only" />
        <span className="pointColor">어떤 곳</span>일까요?
      </h2>
      <div className="blog-text-card-grid">
        {Object.entries(blogs).flatMap(([placeId, posts]) =>
          posts.map((b, i) => (
            <div className="blog-text-card" key={`${placeId}-${i}`}>
              <div className="card-image">
                <img
                  src={b.thumbnail || "/images/no-image.png"}
                  alt={b.title}
                  onError={(e) => {
                    e.currentTarget.src = "/images/no-image.png";
                  }}
                />
              </div>
              <div className="card-body">
                <div className="card-meta">
                  <span className="author">
                    <FontAwesomeIcon icon={faUser as IconProp} /> {b.blogname}
                  </span>
                  <span className="date">
                    <FontAwesomeIcon icon={faCalendar as IconProp} />{" "}
                    {b.datetime.slice(5, 10)}
                  </span>
                </div>
                <h3 className="card-title">{b.title}</h3>
                <a
                  href={b.url}
                  target="_blank"
                  rel="noreferrer"
                  className="card-link"
                >
                  블로그 후기 보기 <span className="external-icon">↗</span>
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
