import { Utensils } from 'lucide-react';
import type { SVGAttributes } from 'react';

export default function AppLogoIcon({
    className,
}: Pick<SVGAttributes<SVGElement>, 'className'>) {
    return <Utensils className={className} />;
}
