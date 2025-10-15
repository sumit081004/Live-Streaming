import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Trash2, Edit } from "lucide-react";

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

interface OverlayManagerProps {
  onSelectOverlay: (overlay: Overlay) => void;
  selectedOverlays: string[];
}

export const OverlayManager = ({ onSelectOverlay, selectedOverlays }: OverlayManagerProps) => {
  const [overlays, setOverlays] = useState<Overlay[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingOverlay, setEditingOverlay] = useState<Overlay | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    content: "",
    fontSize: 16,
    color: "#FFFFFF",
  });

  useEffect(() => {
    fetchOverlays();
  }, []);

  const fetchOverlays = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("overlays")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to fetch overlays");
    } else {
      setOverlays(data || []);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    if (editingOverlay) {
      const { error } = await supabase
        .from("overlays")
        .update({
          name: formData.name,
          content: formData.content,
          font_size: formData.fontSize,
          color: formData.color,
        })
        .eq("id", editingOverlay.id);

      if (error) {
        toast.error("Failed to update overlay");
      } else {
        toast.success("Overlay updated!");
        fetchOverlays();
        resetForm();
      }
    } else {
      const { error } = await supabase.from("overlays").insert({
        user_id: user.id,
        name: formData.name,
        content: formData.content,
        position_x: 50,
        position_y: 50,
        width: 200,
        height: 100,
        font_size: formData.fontSize,
        color: formData.color,
      });

      if (error) {
        toast.error("Failed to create overlay");
      } else {
        toast.success("Overlay created!");
        fetchOverlays();
        resetForm();
      }
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("overlays").delete().eq("id", id);

    if (error) {
      toast.error("Failed to delete overlay");
    } else {
      toast.success("Overlay deleted!");
      fetchOverlays();
    }
  };

  const resetForm = () => {
    setFormData({ name: "", content: "", fontSize: 16, color: "#FFFFFF" });
    setEditingOverlay(null);
    setIsOpen(false);
  };

  const startEdit = (overlay: Overlay) => {
    setEditingOverlay(overlay);
    setFormData({
      name: overlay.name,
      content: overlay.content,
      fontSize: overlay.font_size,
      color: overlay.color,
    });
    setIsOpen(true);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Overlay Manager</CardTitle>
        <CardDescription>Create and manage your stream overlays</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Create Overlay
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingOverlay ? "Edit Overlay" : "Create Overlay"}</DialogTitle>
              <DialogDescription>
                {editingOverlay ? "Update your overlay settings" : "Add a new overlay to your stream"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Input
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fontSize">Font Size</Label>
                  <Input
                    id="fontSize"
                    type="number"
                    value={formData.fontSize}
                    onChange={(e) => setFormData({ ...formData, fontSize: parseInt(e.target.value) })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="color">Color</Label>
                  <Input
                    id="color"
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {editingOverlay ? "Update" : "Create"}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        <div className="space-y-2">
          {overlays.map((overlay) => (
            <div
              key={overlay.id}
              className="flex items-center justify-between p-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
            >
              <div className="flex-1">
                <h3 className="font-medium">{overlay.name}</h3>
                <p className="text-sm text-muted-foreground">{overlay.content}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={selectedOverlays.includes(overlay.id) ? "default" : "outline"}
                  onClick={() => onSelectOverlay(overlay)}
                >
                  {selectedOverlays.includes(overlay.id) ? "Hide" : "Show"}
                </Button>
                <Button size="sm" variant="ghost" onClick={() => startEdit(overlay)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDelete(overlay.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          {overlays.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No overlays yet. Create your first one!
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
