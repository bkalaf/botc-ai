// src/server/getIcon.tsx
import {
    faSquare0,
    faSquare1,
    faSquare2,
    faSquare3,
    faSquare4,
    faSquare5,
    faSquare6,
    faThumbsDown,
    faThumbsUp
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export function getIcon(num: number) {
    function inner() {
        switch (num) {
            case 0:
                return faSquare0;
            case 1:
                return faSquare1;
            case 2:
                return faSquare2;
            case 3:
                return faSquare3;
            case 4:
                return faSquare4;
            case 5:
                return faSquare5;
            case 6:
                return faSquare6;
            default:
                throw new Error(`no number: ${num}`);
        }
    }
    const result = () => (
        <FontAwesomeIcon
            icon={inner()}
            size='5x'
            className='bg-blue-500 w-1/5 h-1/5 object-cover'
        />
    );
    result.displayName = 'Number';
    return result;
}

export function getBooleanIcon(shown: boolean) {
    return shown ?
            () => (
                <FontAwesomeIcon
                    icon={faThumbsUp}
                    size='5x'
                    className='bg-blue-500 w-1/5 h-1/5 object-cover'
                />
            )
        :   () => (
                <FontAwesomeIcon
                    icon={faThumbsDown}
                    size='5x'
                    className='bg-blue-500 w-1/5 h-1/5 object-cover'
                />
            );
}
