import { TriangleAlert, Info } from 'lucide-react';

type Allergy = {
    id: number;
    allergen: string;
    severity: 'mild' | 'moderate' | 'severe';
};

type AllergyBannerProps = {
    allergies: Allergy[];
    hasBeenChecked: boolean;
};

const severityLabel: Record<string, string> = {
    mild: 'ringan',
    moderate: 'sedang',
    severe: 'berat',
};

export default function AllergyBanner({ allergies, hasBeenChecked }: AllergyBannerProps) {
    if (allergies.length > 0) {
        return (
            <div className="flex items-start gap-2 rounded-md border-l-4 border-red-600 bg-red-50 px-3 py-2 text-sm text-red-800">
                <TriangleAlert className="size-4 mt-0.5 shrink-0" />
                <p className="font-medium">
                    Alergi:{' '}
                    {allergies.map((a, i) => (
                        <span key={a.id}>
                            {a.allergen} ({severityLabel[a.severity]})
                            {i < allergies.length - 1 ? ', ' : ''}
                        </span>
                    ))}
                </p>
            </div>
        );
    }

    if (!hasBeenChecked) {
        return null;
    }

    return (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Info className="size-3" />
            Tidak ada alergi tercatat
        </div>
    );
}
