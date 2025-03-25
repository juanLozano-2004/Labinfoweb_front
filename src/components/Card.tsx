import "../styles/HomePage.css";
interface CardProps {
    title: string;
    onClick?: () => void;
  }
  
  export default function Card({ title, onClick }: CardProps) {
    return (
      <div className="card" onClick={onClick}>
        <h2 className="card-title">{title}</h2>
      </div>
    );
  }
  