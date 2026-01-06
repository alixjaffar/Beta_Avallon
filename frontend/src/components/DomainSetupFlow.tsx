import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Check, X, Loader2, Globe, DollarSign, Search, 
  ArrowRight, Shield, Zap, Mail, Server, 
  CheckCircle2, Circle, ChevronRight, Sparkles,
  Lock, RefreshCw, ExternalLink
} from "lucide-react";
import { Site } from "@/lib/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DomainSetupFlowProps {
  sites: Site[];
}

const POPULAR_TLDS = [
  { tld: "com", label: ".com", popular: true },
  { tld: "io", label: ".io", popular: true },
  { tld: "co", label: ".co", popular: true },
  { tld: "ai", label: ".ai", popular: true },
  { tld: "app", label: ".app", popular: false },
  { tld: "dev", label: ".dev", popular: false },
  { tld: "net", label: ".net", popular: false },
  { tld: "org", label: ".org", popular: false },
  { tld: "ca", label: ".ca", popular: false },
  { tld: "xyz", label: ".xyz", popular: false },
  { tld: "site", label: ".site", popular: false },
  { tld: "online", label: ".online", popular: false },
  { tld: "store", label: ".store", popular: false },
  { tld: "tech", label: ".tech", popular: false },
  { tld: "cloud", label: ".cloud", popular: false },
];

export function DomainSetupFlow({ sites }: DomainSetupFlowProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [domainName, setDomainName] = useState("");
  const [checking, setChecking] = useState(false);
  const [availableDomains, setAvailableDomains] = useState<Array<{domain: string; available: boolean; price?: number}>>([]);
  const [selectedDomain, setSelectedDomain] = useState<string>("");
  const [selectedSite, setSelectedSite] = useState<string>("");
  const [settingUp, setSettingUp] = useState(false);
  const [pricingMap, setPricingMap] = useState<Record<string, number>>({});
  const [loadingPricing, setLoadingPricing] = useState(false);
  const [setupComplete, setSetupComplete] = useState(false);
  const { toast } = useToast();

  const baseUrl = typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:3000'
    : 'https://beta-avallon.onrender.com';

  const TLD_OPTIONS = POPULAR_TLDS.map(t => t.tld);

  // Fetch pricing from Namecheap API on component mount
  useEffect(() => {
    const fetchPricing = async () => {
      setLoadingPricing(true);
      try {
        const res = await fetch(`${baseUrl}/api/namecheap/pricing`);
        if (res.ok) {
          const data = await res.json();
          if (data.prices) {
            setPricingMap(data.prices);
          }
        }
      } catch (error) {
        console.error('Failed to fetch pricing:', error);
        // Set default prices as fallback
        setPricingMap({
          com: 12.99, net: 14.99, org: 12.99, io: 39.99, co: 29.99,
          app: 15.99, dev: 15.99, ai: 79.99, ca: 12.99, xyz: 2.99,
          site: 3.99, online: 4.99, store: 5.99, tech: 6.99, cloud: 9.99
        });
      } finally {
        setLoadingPricing(false);
      }
    };
    fetchPricing();
  }, [baseUrl]);

  // Fallback prices (Namecheap base + $3 Avallon markup)
  const FALLBACK_PRICES: Record<string, number> = {
    com: 13.28, net: 15.88, org: 12.18, io: 35.88, co: 28.88, 
    app: 17.00, dev: 15.00, ai: 72.88, ca: 13.98,
    xyz: 4.00, site: 4.88, online: 5.88, store: 6.88, 
    blog: 7.88, tech: 7.88, cloud: 11.88, space: 4.88, 
    info: 5.88, me: 5.88
  };

  const formatPrice = (tld: string, price?: number): string => {
    if (price !== undefined && price > 0) {
      return `$${price.toFixed(2)}`;
    }
    if (pricingMap[tld]) {
      return `$${pricingMap[tld].toFixed(2)}`;
    }
    // Always return a price - use fallback
    if (FALLBACK_PRICES[tld]) {
      return `$${FALLBACK_PRICES[tld].toFixed(2)}`;
    }
    return "$12.99"; // Default fallback
  };

  const handleCheckDomain = async () => {
    if (!domainName.trim()) {
      toast({
        title: "Enter a domain name",
        description: "Please enter the domain you'd like to search for",
        variant: "destructive",
      });
      return;
    }

    setChecking(true);
    setAvailableDomains([]);
    try {
      const cleanName = domainName.trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
      const payload = domainName.includes('.') 
        ? { domain: domainName.toLowerCase() } 
        : { name: cleanName, tlds: TLD_OPTIONS };
      
      const res = await fetch(`${baseUrl}/api/namecheap/domain/check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Check failed');

      if (Array.isArray(data.results)) {
        // Sort: available first, then by price
        const sorted = data.results.sort((a: any, b: any) => {
          if (a.available && !b.available) return -1;
          if (!a.available && b.available) return 1;
          return (a.price || 0) - (b.price || 0);
        });
        setAvailableDomains(sorted);
        const available = sorted.filter((r: any) => r.available);
        if (available.length > 0) {
          setStep(2);
          toast({
            title: "Domains found!",
            description: `${available.length} domain${available.length > 1 ? 's' : ''} available`,
          });
        } else {
          toast({
            title: "No domains available",
            description: "Try a different name",
            variant: "destructive",
          });
        }
      } else {
        if (data.available) {
          setAvailableDomains([{ domain: domainName.toLowerCase(), available: true, price: data.price }]);
          setStep(2);
        } else {
          toast({
            title: "Domain unavailable",
            description: "This domain is already taken. Try another name.",
            variant: "destructive",
          });
        }
      }
    } catch (error: any) {
      toast({
        title: "Search failed",
        description: error.message || "Failed to check domain availability",
        variant: "destructive",
      });
    } finally {
      setChecking(false);
    }
  };

  const handleSelectDomain = (domain: string) => {
    setSelectedDomain(domain);
  };

  const handlePurchaseDomain = async () => {
    if (!selectedDomain) {
      toast({
        title: "Select a domain",
        description: "Please select a domain first",
        variant: "destructive",
      });
      return;
    }

    setSettingUp(true);
    try {
      // Initiate domain purchase through Stripe
      const purchaseRes = await fetch(`${baseUrl}/api/domains/purchase`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-user-email': localStorage.getItem('userEmail') || '',
        },
        body: JSON.stringify({ 
          domain: selectedDomain,
          years: 1,
          successUrl: `${window.location.origin}/dashboard?domain_purchased=${selectedDomain}`,
          cancelUrl: `${window.location.origin}/dashboard?domain_cancelled=${selectedDomain}`,
        }),
      });

      const data = await purchaseRes.json();

      if (!purchaseRes.ok) {
        throw new Error(data.error || 'Purchase initiation failed');
      }

      // If Stripe checkout URL is returned, redirect to it
      if (data.checkoutUrl) {
        toast({
          title: "Redirecting to payment...",
          description: "You'll be redirected to complete your purchase",
        });
        window.location.href = data.checkoutUrl;
        return;
      }

      // If mock/direct purchase succeeded
      if (data.success) {
        // Set up DNS records after successful purchase
        try {
          await fetch(`${baseUrl}/api/namecheap/dns/apply-records`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              domain: selectedDomain,
              records: [
                { type: "A", name: "@", value: "76.76.21.21" },
                { type: "CNAME", name: "www", value: "cname.vercel-dns.com" },
              ],
            }),
          });
        } catch (dnsError) {
          console.error('DNS setup error:', dnsError);
          // Continue even if DNS setup fails
        }

        setSetupComplete(true);
        setStep(5);
        toast({
          title: "🎉 Domain purchased!",
          description: data.mock 
            ? `${selectedDomain} purchased in test mode`
            : `${selectedDomain} is now yours!`,
        });
      }
    } catch (error: any) {
      toast({
        title: "Purchase failed",
        description: error.message || "Failed to purchase domain",
        variant: "destructive",
      });
    } finally {
      setSettingUp(false);
    }
  };

  const resetFlow = () => {
    setStep(1);
    setDomainName("");
    setSelectedDomain("");
    setSelectedSite("");
    setAvailableDomains([]);
    setSetupComplete(false);
  };

  const steps = [
    { num: 1, label: "Search", icon: Search },
    { num: 2, label: "Select", icon: Globe },
    { num: 3, label: "Connect", icon: Server },
    { num: 4, label: "Configure", icon: Shield },
    { num: 5, label: "Complete", icon: CheckCircle2 },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-8 md:p-12 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5" />
            <span className="text-sm font-medium text-white/90">Powered by Namecheap</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Get Your Perfect Domain
          </h1>
          <p className="text-lg text-white/80 max-w-2xl">
            Search, register, and connect your custom domain in minutes. Real-time pricing and instant DNS configuration.
          </p>
          
          {/* Feature badges */}
          <div className="flex flex-wrap gap-3 mt-6">
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm">
              <Lock className="w-4 h-4" />
              <span>Free WHOIS Privacy</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm">
              <Zap className="w-4 h-4" />
              <span>Instant DNS Setup</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm">
              <Mail className="w-4 h-4" />
              <span>Email Hosting Ready</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between px-4">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          const isActive = step === s.num;
          const isComplete = step > s.num;
          
          return (
            <div key={s.num} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={`
                  w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300
                  ${isComplete ? 'bg-green-500 text-white' : ''}
                  ${isActive ? 'bg-indigo-600 text-white ring-4 ring-indigo-200' : ''}
                  ${!isActive && !isComplete ? 'bg-secondary text-muted-foreground' : ''}
                `}>
                  {isComplete ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>
                <span className={`text-xs mt-2 font-medium ${isActive ? 'text-indigo-600' : 'text-gray-500'}`}>
                  {s.label}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div className={`w-12 md:w-24 h-1 mx-2 rounded-full transition-colors duration-300 ${
                  step > s.num ? 'bg-green-500' : 'bg-secondary'
                }`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Step 1: Search Domain */}
      {step === 1 && (
        <Card className="border border-border shadow-xl bg-card">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl flex items-center gap-3 text-foreground">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center">
                <Search className="w-5 h-5 text-white" />
              </div>
              Find Your Domain
            </CardTitle>
            <CardDescription className="text-base text-muted-foreground">
              Enter a name and we'll show you all available options with real-time pricing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Globe className="w-5 h-5" />
              </div>
              <Input
                placeholder="Enter your domain name (e.g., mybusiness)"
                value={domainName}
                onChange={(e) => setDomainName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !checking && domainName.trim() && handleCheckDomain()}
                className="h-14 pl-12 pr-32 text-lg border-2 border-border focus:border-indigo-500 rounded-xl bg-background text-foreground"
                disabled={checking}
              />
              <Button 
                onClick={handleCheckDomain} 
                disabled={checking || !domainName.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-10 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-lg text-white"
              >
                {checking ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Searching
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </>
                )}
              </Button>
            </div>
            
            {/* Popular TLDs */}
            <div className="pt-4">
              <p className="text-sm text-muted-foreground mb-3">Popular extensions:</p>
              <div className="flex flex-wrap gap-2">
                {POPULAR_TLDS.filter(t => t.popular).map((tld) => (
                  <button
                    key={tld.tld}
                    onClick={() => {
                      if (domainName && !domainName.includes('.')) {
                        setDomainName(`${domainName}.${tld.tld}`);
                      }
                    }}
                    className="px-4 py-2 bg-secondary hover:bg-indigo-600 hover:text-white rounded-lg text-sm font-medium transition-colors text-foreground"
                  >
                    {tld.label}
                    <span className="ml-2 text-xs opacity-70">
                      {formatPrice(tld.tld)}/yr
                    </span>
                  </button>
                ))}
              </div>
            </div>
            
            {loadingPricing && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Loading live pricing from Namecheap...</span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 2: Select Domain */}
      {step === 2 && (
        <Card className="border border-border shadow-xl bg-card">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl flex items-center gap-3 text-foreground">
              <div className="w-10 h-10 rounded-xl bg-green-600 flex items-center justify-center">
                <Globe className="w-5 h-5 text-white" />
              </div>
              Choose Your Domain
            </CardTitle>
            <CardDescription className="text-base text-muted-foreground">
              {availableDomains.filter(d => d.available).length} domain{availableDomains.filter(d => d.available).length !== 1 ? 's' : ''} available for "{domainName.split('.')[0]}"
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableDomains.map((domain) => {
                const tld = domain.domain.split('.').pop() || '';
                const price = formatPrice(tld, domain.price);
                const isSelected = selectedDomain === domain.domain;
                const isPopular = POPULAR_TLDS.find(t => t.tld === tld)?.popular;
                
                if (!domain.available) return null;
                
                return (
                  <div
                    key={domain.domain}
                    onClick={() => handleSelectDomain(domain.domain)}
                    className={`
                      relative p-5 rounded-xl border-2 cursor-pointer transition-all duration-200
                      ${isSelected 
                        ? 'border-indigo-500 bg-indigo-500/10 shadow-lg ring-4 ring-indigo-500/20' 
                        : 'border-border hover:border-indigo-400 hover:shadow-md bg-card'
                      }
                    `}
                  >
                    {isPopular && (
                      <div className="absolute -top-2 -right-2">
                        <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
                          Popular
                        </Badge>
                      </div>
                    )}
                    
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isSelected ? 'bg-indigo-500 text-white' : 'bg-green-100 text-green-600'
                      }`}>
                        {isSelected ? <Check className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
                      </div>
                      <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30">
                        Available
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-lg font-bold text-foreground">{domain.domain}</div>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-indigo-500">{price}</span>
                        <span className="text-sm text-muted-foreground">/year</span>
                      </div>
                    </div>
                    
                    {isSelected && (
                      <div className="mt-4 pt-3 border-t border-indigo-200">
                        <div className="flex items-center gap-2 text-sm text-indigo-600 font-medium">
                          <CheckCircle2 className="w-4 h-4" />
                          Selected
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={() => setStep(1)} className="px-6">
                ← Back
              </Button>
              <Button 
                onClick={() => setStep(3)}
                disabled={!selectedDomain}
                className="flex-1 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-lg"
              >
                Continue with {selectedDomain || 'domain'}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Connect Website */}
      {step === 3 && (
        <Card className="border border-border shadow-xl bg-card">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl flex items-center gap-3 text-foreground">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
                <Server className="w-5 h-5 text-white" />
              </div>
              Connect Your Website
            </CardTitle>
            <CardDescription className="text-base text-muted-foreground">
              Link <span className="font-semibold text-foreground">{selectedDomain}</span> to one of your websites
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {sites.length > 0 ? (
              <>
                <div className="grid gap-3">
                  {sites.map((site) => (
                    <div
                      key={site.id}
                      onClick={() => setSelectedSite(site.id)}
                      className={`
                        p-4 rounded-xl border-2 cursor-pointer transition-all duration-200
                        ${selectedSite === site.id 
                          ? 'border-blue-500 bg-blue-500/10 shadow-md' 
                          : 'border-border hover:border-blue-400 bg-card'
                        }
                      `}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          selectedSite === site.id ? 'bg-blue-500 text-white' : 'bg-secondary text-muted-foreground'
                        }`}>
                          <Globe className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-lg">{site.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {site.previewUrl || 'No preview URL'}
                          </div>
                        </div>
                        {selectedSite === site.id && (
                          <CheckCircle2 className="w-6 h-6 text-blue-500" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                      <Zap className="w-4 h-4 text-amber-600" />
                    </div>
                    <div>
                      <p className="font-medium text-amber-800">Optional Step</p>
                      <p className="text-sm text-amber-700">
                        You can skip this step and configure the website connection later.
                      </p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-lg font-medium text-muted-foreground mb-2">No websites yet</p>
                <p className="text-muted-foreground">
                  Create a website first, then come back to connect your domain.
                </p>
              </div>
            )}
            
            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={() => setStep(2)} className="px-6">
                ← Back
              </Button>
              <Button 
                onClick={() => setStep(4)}
                className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg"
              >
                {selectedSite ? 'Continue to DNS Setup' : 'Skip & Continue'}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: DNS Configuration */}
      {step === 4 && (
        <Card className="border border-border shadow-xl bg-card">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl flex items-center gap-3 text-foreground">
              <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              Configure DNS
            </CardTitle>
            <CardDescription className="text-base text-muted-foreground">
              Review and apply DNS settings for <span className="font-semibold text-foreground">{selectedDomain}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Order Summary */}
            <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-xl p-6 border border-indigo-500/20">
              <h4 className="font-semibold text-lg mb-4 flex items-center gap-2 text-foreground">
                <DollarSign className="w-5 h-5 text-indigo-500" />
                Order Summary
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Domain Registration</span>
                  <span className="font-semibold">{selectedDomain}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="font-semibold text-foreground">1 Year</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">WHOIS Privacy</span>
                  <span className="text-green-600 font-medium">FREE</span>
                </div>
                <hr className="border-indigo-200" />
                <div className="flex justify-between items-center text-lg">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-indigo-600">
                    {formatPrice(selectedDomain.split('.').pop() || 'com')}/year
                  </span>
                </div>
              </div>
            </div>
            
            {/* DNS Records */}
            <div className="bg-secondary/50 rounded-xl p-6 border border-border">
              <h4 className="font-semibold text-lg mb-4 flex items-center gap-2 text-foreground">
                <Server className="w-5 h-5 text-muted-foreground" />
                DNS Records (Auto-configured)
              </h4>
              <div className="space-y-3 font-mono text-sm">
                <div className="flex items-center gap-4 p-3 bg-card rounded-lg border border-border">
                  <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/30">A</Badge>
                  <span className="text-muted-foreground">@</span>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium text-foreground">76.76.21.21</span>
                </div>
                <div className="flex items-center gap-4 p-3 bg-card rounded-lg border border-border">
                  <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30">CNAME</Badge>
                  <span className="text-muted-foreground">www</span>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium text-foreground">cname.vercel-dns.com</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={() => setStep(3)} className="px-6">
                ← Back
              </Button>
              <Button 
                onClick={handlePurchaseDomain}
                disabled={settingUp}
                className="flex-1 h-14 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-lg font-semibold"
              >
                {settingUp ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    Pay & Register Domain
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 5: Success */}
      {step === 5 && (
        <Card className="border border-border shadow-xl overflow-hidden bg-card">
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-8 text-white text-center">
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-bold mb-2">🎉 Congratulations!</h2>
            <p className="text-lg text-white/90">Your domain is ready to use</p>
          </div>
          
          <CardContent className="p-8 space-y-6">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-secondary rounded-xl">
                <Globe className="w-5 h-5 text-indigo-500" />
                <span className="text-xl font-bold text-foreground">{selectedDomain}</span>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-green-500/10 rounded-xl border border-green-500/20">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span className="font-semibold text-green-500">Domain Registered</span>
                </div>
                <p className="text-sm text-green-400">Your domain has been successfully purchased</p>
              </div>
              
              <div className="p-4 bg-green-500/10 rounded-xl border border-green-500/20">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span className="font-semibold text-green-500">DNS Configured</span>
                </div>
                <p className="text-sm text-green-400">DNS records have been applied automatically</p>
              </div>
              
              <div className="p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
                <div className="flex items-center gap-3 mb-2">
                  <RefreshCw className="w-5 h-5 text-blue-500" />
                  <span className="font-semibold text-blue-500">Propagating</span>
                </div>
                <p className="text-sm text-blue-400">DNS changes may take up to 48 hours to fully propagate</p>
              </div>
              
              <div className="p-4 bg-purple-500/10 rounded-xl border border-purple-500/20">
                <div className="flex items-center gap-3 mb-2">
                  <Lock className="w-5 h-5 text-purple-500" />
                  <span className="font-semibold text-purple-500">WHOIS Privacy</span>
                </div>
                <p className="text-sm text-purple-400">Your personal information is protected</p>
              </div>
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={resetFlow} className="flex-1">
                <Search className="w-4 h-4 mr-2" />
                Register Another Domain
              </Button>
              <Button 
                onClick={() => window.open(`https://${selectedDomain}`, '_blank')}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Visit Your Domain
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
