<<<<<<< HEAD
import PlusSvg from "./PlusSvg";
=======
import PlusSvg from "./PlusSvg.jsx";
>>>>>>> b65e2d9f90adeb6abb94f4b2feac94b03cee3080

const SectionSvg = ({ crossesOffset }) => {
  return (
    <>
      <PlusSvg
        className={`hidden absolute -top-[0.3125rem] left-[1.5625rem] ${
          crossesOffset && crossesOffset
        } pointer-events-none lg:block xl:left-[2.1875rem]`}
      />

      <PlusSvg
        className={`hidden absolute  -top-[0.3125rem] right-[1.5625rem] ${
          crossesOffset && crossesOffset
        } pointer-events-none lg:block xl:right-[2.1875rem]`}
      />
    </>
  );
};

export default SectionSvg;
