import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { VideoPlayer } from "@/components/VideoPlayer";
import { DraggableOverlay } from "@/components/DraggableOverlay";
import { OverlayManager } from "@/components/OverlayManager";
import { LogOut, Play } from "lucide-react";
import { toast } from "sonner";

interface Overlay {
  id: string;
  name: string;
  content: string;
  position_x: number;
  position_y: number;
  width: number;
  height: number;
  font_size: number;
  color: string;
}

const AppPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [videoUrl, setVideoUrl] = useState("https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4");
  const [activeOverlays, setActiveOverlays] = useState<Overlay[]>([]);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/login");
    } else {
      setUser(user);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleSelectOverlay = (overlay: Overlay) => {
    setActiveOverlays((prev) => {
      const exists = prev.find((o) => o.id === overlay.id);
      if (exists) {
        return prev.filter((o) => o.id !== overlay.id);
      }
      return [...prev, overlay];
    });
  };

  const handleUpdateOverlay = async (id: string, x: number, y: number, width: number, height: number) => {
    const { error } = await supabase
      .from("overlays")
      .update({
        position_x: x,
        position_y: y,
        width: width,
        height: height,
      })
      .eq("id", id);

    if (error) {
      toast.error("Failed to save overlay position");
    } else {
      toast.success("Overlay position saved");
      // Update local state
      setActiveOverlays((prev) =>
        prev.map((overlay) =>
          overlay.id === id
            ? { ...overlay, position_x: x, position_y: y, width, height }
            : overlay
        )
      );
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-primary">
              <Play className="h-6 w-6" fill="currentColor" />
              <span className="text-xl font-bold">StreamOverlay</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">{user.email}</span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-[1fr_400px] gap-8">
          {/* Video Player Section */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="videoUrl">Stream URL</Label>
              <div className="flex gap-2">
                <Input
                  id="videoUrl"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="Enter RTSP URL (requires transcoding) or video URL"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Note: RTSP streams require server-side transcoding to HLS/DASH. For demo, use a standard video URL.
              </p>
            </div>

            <div className="relative">
              <VideoPlayer videoUrl={videoUrl} className="h-[600px]">
                {activeOverlays.map((overlay) => (
                  <DraggableOverlay
                    key={overlay.id}
                    id={overlay.id}
                    content={overlay.content}
                    initialX={overlay.position_x}
                    initialY={overlay.position_y}
                    width={overlay.width}
                    height={overlay.height}
                    fontSize={overlay.font_size}
                    color={overlay.color}
                    onUpdate={handleUpdateOverlay}
                  />
                ))}
              </VideoPlayer>
            </div>
          </div>

          {/* Overlay Manager Section */}
          <div>
            <OverlayManager
              onSelectOverlay={handleSelectOverlay}
              selectedOverlays={activeOverlays.map((o) => o.id)}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AppPage;
