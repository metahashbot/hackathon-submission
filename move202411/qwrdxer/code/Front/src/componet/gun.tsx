
import gunlogo from '../public/gun.svg';
import "./pro.css";
export function GunImg({ angle }: { angle: number }) {


    return (
        <>
            <img src={gunlogo} className="gun-logo" alt="logo" style={{ transform: `rotate(${angle}deg)` }} />
        </>

    )
}
export default GunImg