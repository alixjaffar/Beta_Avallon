import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@shadcn/ui';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-8">Welcome to Auto Detailing</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Exterior Detailing</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Our exterior detailing service will have your car looking brand new. We use only the
              highest quality products and techniques to ensure a perfect finish.
            </CardDescription>
          </CardContent>
          <Button variant="default">Learn More</Button>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Interior Detailing</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Our interior detailing service will have your car's interior looking and smelling
              fresh. We'll clean and condition all surfaces to make your car feel brand new.
            </CardDescription>
          </CardContent>
          <Button variant="default">Learn More</Button>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Full Service Detailing</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Our full service detailing package includes both exterior and interior detailing,
              ensuring your car looks and feels its best.
            </CardDescription>
          </CardContent>
          <Button variant="default">Learn More</Button>
        </Card>
      </div>
    </div>
  );
}
