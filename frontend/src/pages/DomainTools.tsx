import { useMemo, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";

const DomainTools = () => {
  const [domain, setDomain] = useState("");
  const [checking, setChecking] = useState(false);
  const [available, setAvailable] = useState<null | boolean>(null);
  const [suggestions, setSuggestions] = useState<Array<{domain:string;available:boolean}>>([]);
  const [registering, setRegistering] = useState(false);
  const { toast } = useToast();

  const baseUrl = typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:3000'
    : 'https://avallon.ca';

  const TLD_OPTIONS = useMemo(() => (
    [
      "com","net","org","io","co","app","dev","ai","ca","xyz","site","online",
      "store","blog","tech","cloud","space","info","me","app","dev"
    ]
  ), []);

  const PRICE_MAP: Record<string, string> = {
    com: "$15.32/yr",
    net: "$16.99/yr",
    org: "$22.26/yr",
    io: "$49.99/yr",
    co: "$34.99/yr",
    app: "$19.99/yr",
    dev: "$19.99/yr",
    ai: "$69.99/yr",
    ca: "$13.99/yr",
    xyz: "$2.99/yr",
    site: "$2.99/yr",
    online: "$3.99/yr",
    store: "$4.99/yr",
    blog: "$5.99/yr",
    tech: "$7.99/yr",
    cloud: "$9.99/yr",
    space: "$2.99/yr",
    info: "$3.99/yr",
    me: "$3.99/yr",
  };

  const checkAvailability = async () => {
    if (!domain.trim()) return;
    setChecking(true);
    setAvailable(null);
    try {
      const payload = domain.includes('.') ? { domain } : { name: domain, tlds: TLD_OPTIONS };
      const res = await fetch(`${baseUrl}/api/namecheap/domain/check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Check failed');
      if (Array.isArray(data.results)) {
        const onlyAvailable = data.results.filter((r: any) => r.available);
        setSuggestions(onlyAvailable);
        const chosen = onlyAvailable.find((r: any) => r.domain === domain);
        setAvailable(chosen ? Boolean(chosen.available) : null);
        toast({ title: "Results", description: `${onlyAvailable.length} available options` });
      } else {
        setSuggestions([]);
        setAvailable(Boolean(data.available));
        toast({ title: data.available ? "Available" : "Unavailable", description: domain });
      }
    } catch (e) {
      toast({ title: "Error", description: "Failed to check domain", variant: "destructive" });
    } finally {
      setChecking(false);
    }
  };

  const registerDomain = async () => {
    if (!domain.trim()) return;
    setRegistering(true);
    try {
      const res = await fetch(`${baseUrl}/api/namecheap/domain/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');
      toast({ title: "Registered", description: `${domain} purchased in sandbox/test mode` });
    } catch (e) {
      toast({ title: "Error", description: "Failed to register domain", variant: "destructive" });
    } finally {
      setRegistering(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Domain Tools</CardTitle>
            <CardDescription>Check availability and register via Namecheap (sandbox)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input placeholder="yourdomain.com" value={domain} onChange={(e) => setDomain(e.target.value)} />
            <div className="flex gap-2">
              <Button onClick={checkAvailability} disabled={checking}>Check</Button>
              <Button onClick={registerDomain} disabled={!available || registering} variant="outline">Register</Button>
            </div>
            {available !== null && (
              <p className="text-sm text-muted-foreground">Status: {available ? 'Available' : 'Not available'}</p>
            )}
            {suggestions.length > 0 && (
              <div className="mt-4 space-y-4">
                <p className="text-sm font-medium">Suggestions</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {suggestions.map(s => {
                    const tld = s.domain.split('.').pop() || '';
                    const price = PRICE_MAP[tld] || "$—";
                    return (
                      <Card key={s.domain} className={`border-2 ${s.available ? 'border-green-300' : 'border-border'}`}>
                        <CardContent className="py-3 px-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {s.available ? (
                              <Check className="w-4 h-4 text-green-600" />
                            ) : (
                              <X className="w-4 h-4 text-muted-foreground" />
                            )}
                            <div>
                              <div className="text-sm font-medium">{s.domain}</div>
                              <div className="text-xs text-muted-foreground">{price}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={s.available ? 'default' : 'secondary'}>
                              {s.available ? 'Available' : 'Unavailable'}
                            </Badge>
                            <Button size="sm" variant={s.available ? 'default' : 'outline'} disabled={!s.available} onClick={() => setDomain(s.domain)}>
                              {s.available ? 'Select' : 'View'}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DomainTools;


