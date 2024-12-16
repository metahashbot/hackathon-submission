

import { Flex } from '@radix-ui/themes';
import fakebullet from '../public/fake.svg';
import realbullet from '../public/real.svg';
import "./pro.css";
export function KnowBullet({ bulletknow }: { bulletknow: boolean[] }) {

    const bulletinfo = bulletknow.map(item => {
        return <img src={item ? realbullet : fakebullet} className="bullet-logo" alt={item.toString()} />
    });

    return (
        <Flex gap="1">
            {bulletinfo}
        </Flex>

    )
}
export default KnowBullet