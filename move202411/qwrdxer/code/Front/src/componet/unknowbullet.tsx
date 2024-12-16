
import { Flex } from '@radix-ui/themes';
import unknown from '../public/unknown.svg';
import "./pro.css";
export function UnknowBullet({ bulletleft }: { bulletleft: number }) {


    return (
        <Flex gap="1">
            {Array.from({ length: bulletleft }, (_, index) => (
                <img src={unknown} className="bullet-logo" alt={index.toString()} />
            ))}
        </Flex>

    )
}
export default UnknowBullet