<<<<<<< HEAD
import brackets from "../assets/svg/Brackets";
=======
import brackets from "../assets/svg/Brackets.jsx";
>>>>>>> b65e2d9f90adeb6abb94f4b2feac94b03cee3080

const TagLine = ({ className, children }) => {
  return (
    <div className={`tagline flex items-center ${className || ""}`}>
      {brackets("left")}
      <div className="mx-3 text-n-3">{children}</div>
      {brackets("right")}
    </div>
  );
};

export default TagLine;
