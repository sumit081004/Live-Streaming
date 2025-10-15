import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { VideoPlayer } from "@/components/VideoPlayer";
import { Play, Layers, Zap, Shield } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary">
            <Play className="h-8 w-8" fill="currentColor" />
            <span className="text-2xl font-bold">StreamOverlay</span>
          </div>
          <div className="flex gap-3">
            <Button asChild variant="outline">
              <Link to="/login">Sign in</Link>
            </Button>
            <Button asChild>
              <Link to="/signup">Get Started</Link>
            </Button>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8 mb-16 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Professional Livestream Overlays
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Create, manage, and display custom overlays on your livestreams. 
            Add logos, text, and graphics with drag-and-drop simplicity.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg" className="text-lg">
              <Link to="/signup">Start Free</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg">
              <Link to="/app">View Demo</Link>
            </Button>
          </div>
        </div>

        {/* Demo Video Player */}
        <div className="max-w-4xl mx-auto mb-16">
          <VideoPlayer
            videoUrl="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
            className="h-[500px] shadow-2xl"
          >
            <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm px-4 py-2 rounded-lg">
              <p className="text-white text-sm font-medium">🔴 LIVE DEMO</p>
            </div>
          </VideoPlayer>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-card rounded-xl p-6 border border-border hover:border-primary transition-colors">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Layers className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Custom Overlays</h3>
            <p className="text-muted-foreground">
              Create unlimited overlays with text and logos. Position and resize with drag-and-drop controls.
            </p>
          </div>

          <div className="bg-card rounded-xl p-6 border border-border hover:border-primary transition-colors">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Real-time Updates</h3>
            <p className="text-muted-foreground">
              Manage overlays in real-time while streaming. Save settings for instant recall.
            </p>
          </div>

          <div className="bg-card rounded-xl p-6 border border-border hover:border-primary transition-colors">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">RTSP Compatible</h3>
            <p className="text-muted-foreground">
              Works with RTSP streams. Requires server-side transcoding to HLS/DASH for browser playback.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-3xl mx-auto text-center mt-24 p-12 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
          <h2 className="text-3xl font-bold mb-4">Ready to level up your streams?</h2>
          <p className="text-muted-foreground mb-6">
            Join streamers who trust StreamOverlay for professional broadcast quality.
          </p>
          <Button asChild size="lg" className="text-lg">
            <Link to="/signup">Get Started Free</Link>
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-16 border-t border-border">
        <div className="text-center text-muted-foreground">
          <p>© 2025 StreamOverlay. Professional livestream management.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
