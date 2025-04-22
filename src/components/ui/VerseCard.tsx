
import { Card, CardContent } from "@/components/ui/card";

interface VerseCardProps {
  verse: string;
  reference: string;
}

const VerseCard = ({ verse, reference }: VerseCardProps) => {
  return (
    <Card className="bg-church-50 border-church-300 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <blockquote className="verse-box">
          <p className="text-lg font-medium text-church-800 mb-2">"{verse}"</p>
          <footer className="text-right text-church-600 font-semibold">
            — {reference}
          </footer>
        </blockquote>
      </CardContent>
    </Card>
  );
};

export default VerseCard;
