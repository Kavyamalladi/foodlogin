"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Check, X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { addCategory, updateCategory, deleteCategory } from "@/actions/admin";

type Category = { id: string; name: string; slug: string; productCount: number };

function EditableRow({ category }: { category: Category }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(category.name);
  const [pending, setPending] = useState(false);
  const router = useRouter();

  async function handleSave() {
    if (!name.trim() || name.trim() === category.name) {
      setEditing(false);
      setName(category.name);
      return;
    }
    setPending(true);
    try {
      await updateCategory({ id: category.id, name });
      router.refresh();
      setEditing(false);
    } catch {
      setName(category.name);
    } finally {
      setPending(false);
    }
  }

  function handleCancel() {
    setName(category.name);
    setEditing(false);
  }

  return (
    <div className="flex items-center gap-3 px-5 py-4 border-b border-[#E8D8CC] last:border-0">
      <div className="flex-1 min-w-0">
        {editing ? (
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
              if (e.key === "Escape") handleCancel();
            }}
            autoFocus
            className="h-9 text-sm"
          />
        ) : (
          <div>
            <p className="font-semibold text-[#0f172a]">{category.name}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              /{category.slug} · {category.productCount} {category.productCount === 1 ? "product" : "products"}
            </p>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {editing ? (
          <>
            <Button
              size="sm"
              className="h-9 w-9 p-0 bg-green-600 hover:bg-green-700 text-white"
              onClick={handleSave}
              disabled={pending}
            >
              <Check className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-9 w-9 p-0 border-[#E8D8CC]"
              onClick={handleCancel}
              disabled={pending}
            >
              <X className="w-4 h-4" />
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="outline"
              className="h-10 w-10 p-0 border-[#E8D8CC]"
              onClick={() => setEditing(true)}
            >
              <Pencil className="w-4 h-4" />
            </Button>
            <DeleteCategoryButton category={category} />
          </>
        )}
      </div>
    </div>
  );
}

function DeleteCategoryButton({ category }: { category: Category }) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleDelete() {
    setPending(true);
    setError(null);
    try {
      await deleteCategory({ id: category.id });
      setOpen(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete");
    } finally {
      setPending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="h-10 w-10 p-0 border-[#E8D8CC] text-destructive hover:text-destructive">
          <Trash2 className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete category?</DialogTitle>
          <DialogDescription>
            <strong className="text-foreground">{category.name}</strong> will be permanently deleted.
            {category.productCount > 0 && (
              <span className="block mt-1 text-destructive font-medium">
                This category has {category.productCount} product{category.productCount > 1 ? "s" : ""} — reassign them first.
              </span>
            )}
          </DialogDescription>
        </DialogHeader>
        {error && (
          <p className="text-sm text-destructive bg-destructive/5 border border-destructive/20 rounded-lg px-3 py-2">
            {error}
          </p>
        )}
        <DialogFooter>
          <Button variant="outline" className="w-full sm:w-auto" onClick={() => setOpen(false)} disabled={pending}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            className="w-full sm:w-auto"
            onClick={handleDelete}
            disabled={pending || category.productCount > 0}
          >
            {pending ? "Deleting…" : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AddCategoryForm() {
  const [name, setName] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleAdd() {
    if (!name.trim()) return;
    setPending(true);
    setError(null);
    try {
      await addCategory({ name });
      setName("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="rounded-2xl border border-[#E8D8CC] bg-white p-5 space-y-3">
      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Add Category</p>
      <div className="flex gap-2">
        <Input
          placeholder="e.g. Chutneys"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          className="flex-1"
        />
        <Button
          variant="custom"
          className="shrink-0 px-5"
          onClick={handleAdd}
          disabled={pending || !name.trim()}
        >
          {pending ? "Adding…" : "Add"}
        </Button>
      </div>
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
      <p className="text-xs text-muted-foreground">Slug is auto-generated from the name.</p>
    </div>
  );
}

export function CategoriesList({ categories }: { categories: Category[] }) {
  return (
    <div className="space-y-4">
      <AddCategoryForm />

      {categories.length === 0 ? (
        <div className="rounded-2xl border border-[#E8D8CC] bg-white p-12 text-center">
          <p className="text-sm font-medium text-muted-foreground">No categories yet.</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-[#E8D8CC] bg-white overflow-hidden">
          {categories.map((cat) => (
            <EditableRow key={cat.id} category={cat} />
          ))}
        </div>
      )}
    </div>
  );
}
