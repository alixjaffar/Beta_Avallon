import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

const Automations = () => {
  const [prompt, setPrompt] = useState("");
  const [dsl, setDsl] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const baseUrl = typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:3000'
    : 'https://avallon.ca';

  const generate = async () => {
    if (!prompt.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${baseUrl}/api/automations/plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      setDsl(JSON.stringify(data.dsl, null, 2));
    } catch (e) {
      toast({ title: "Error", description: "Failed to generate plan", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const createWorkflow = async () => {
    try {
      const res = await fetch(`${baseUrl}/api/automations/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dsl: JSON.parse(dsl || '{}') }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      toast({ title: "Workflow created", description: data.url || 'Created in stub mode' });
    } catch (e) {
      toast({ title: "Error", description: "Failed to create workflow", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Automations</h1>
            <p className="text-muted-foreground">Create n8n workflows from natural language prompts</p>
          </div>
          <Link to="/agent-builder">
            <Button variant="outline" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              AI Website Generator
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Prompt to n8n</CardTitle>
            <CardDescription>Describe your automation. We'll draft a safe workflow plan.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea rows={6} value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Example: When a form is submitted, call an API, branch on response, then send an email." />
            <div className="flex gap-2">
              <Button onClick={generate} disabled={submitting}>Generate Plan</Button>
              <Button variant="outline" onClick={createWorkflow} disabled={!dsl}>Create Workflow</Button>
            </div>
            {!!dsl && (
              <pre className="text-xs bg-muted p-3 rounded-md overflow-x-auto whitespace-pre-wrap">{dsl}</pre>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Automations;


