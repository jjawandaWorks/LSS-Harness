import { Button } from "@/components/ui/button";
type ProviderSelectionStepProps = {
  showOpenWorkModels?: boolean;
  onOpenWorkModels: () => void;
  onBringYourOwn: () => void;
  onSkip: () => void;
};

export function ProviderSelectionStep(props: ProviderSelectionStepProps) {
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
    <div className="space-y-4 text-center"><h1 className="text-lg font-medium">Connect Ollama</h1>
      <Button onClick={props.onBringYourOwn}>Choose a local model</Button>
      <Button variant="ghost" onClick={props.onSkip}>Set up later</Button>
    </div>
  </div>;
}
