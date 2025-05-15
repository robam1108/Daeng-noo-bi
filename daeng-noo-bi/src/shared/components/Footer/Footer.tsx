import "./Footer.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

export default function Footer() {
  return (
    <footer
      className="Footer"
      role="contentinfo"
      aria-label="저작권,제작자 정보 푸터"
    >
      {/* 프로젝트 정보 */}
      <div className="info">
        <p>댕누비 - 반려동물과 함께하는 여행</p>
        <p>&copy;{new Date().getFullYear()} DaengNooBi. All rights reserved.</p>
      </div>

      {/* 제작자 링크 */}
      <div className="producer-link">
        <p>
          Developed by :
          <a
            href="https://github.com/orinery"
            aria-label="구채현 GitHub 바로가기"
            target="_blank"
          >
            <FontAwesomeIcon
              icon={faGithub as IconProp}
              className="github-icon"
            />
            orinery
          </a>
          |
          <a
            href="https://github.com/robam1108"
            aria-label="김보람 GitHub 바로가기"
            target="_blank"
          >
            <FontAwesomeIcon
              icon={faGithub as IconProp}
              className="github-icon"
            />
            robam1108
          </a>
        </p>
      </div>
    </footer>
  );
}
