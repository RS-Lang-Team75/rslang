import GitPNG from '../../assets/images/GitHub-Mark-32px.png';

import TelegramSvg from '@/assets/icons/telegram-logo.svg';
import './CardMember.pcss';

interface CardMemberProps {
  imgLink:string;
  memberName:string;
  memberRole:string;
  gitHubLink:string;
  telegramSvg:string;
  cardText:string;
}

export function CardMember ({
  imgLink,
  memberName,
  memberRole,
  gitHubLink,
  telegramSvg,
  cardText,
}:CardMemberProps) : JSX.Element{
  return (

    <div className="card">
      <div className='wrapperImg'>
        <img className="cardImg" src={imgLink} alt={memberName}/>
      </div>

      <div className="cardBody">
        <div className="cardMemberName">{memberName}</div>
        <div className="cardMemberRole">{memberRole}</div>
        <p className="cardText">
          {cardText}
        </p>
      </div>
      <div className="cardFooter">
        <div className="link">
          <a href={gitHubLink}
            rel="noreferrer noopener"
            target="_blank">
            <img src={GitPNG} alt="GitHub link" />
          </a></div>
        <div className="link">
          <a href={telegramSvg}
            rel="noreferrer noopener"
            aria-label = "Telegram-link"
            target="_blank" ><TelegramSvg /></a>
        </div>

      </div>
    </div>
  );
}
