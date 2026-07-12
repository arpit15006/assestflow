import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/shared/ui/dialog";
import { Button } from "@/components/ui/Button";
import { TopAsset, IdleAsset, MaintenanceItem, RetirementAsset } from "@/shared/types";
import { toast } from "sonner";
import { formatChange } from "@/shared/lib/utils";

export function AssetDetailsDialog({ 
  asset, 
  onClose 
}: { 
  asset: TopAsset | IdleAsset | RetirementAsset | null; 
  onClose: () => void 
}) {
  if (!asset) return null;

  return (
    <Dialog open={!!asset} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle>{asset.name}</DialogTitle>
          <DialogDescription>
            Department: {asset.department}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {'utilization' in asset && (
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-zinc-50 p-3 rounded-lg">
                <p className="text-xs text-zinc-500 uppercase">Utilization</p>
                <p className="text-xl font-semibold text-zinc-900">{asset.utilization}%</p>
              </div>
              <div className="bg-zinc-50 p-3 rounded-lg">
                <p className="text-xs text-zinc-500 uppercase">Bookings</p>
                <p className="text-xl font-semibold text-zinc-900">{asset.bookings}</p>
              </div>
            </div>
          )}
          
          {'daysIdle' in asset && (
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-red-50 p-3 rounded-lg ring-1 ring-red-200">
                <p className="text-xs text-red-600 uppercase">Days Idle</p>
                <p className="text-xl font-semibold text-red-700">{asset.daysIdle} days</p>
              </div>
              <div className="bg-zinc-50 p-3 rounded-lg">
                <p className="text-xs text-zinc-500 uppercase">Last Used</p>
                <p className="text-xl font-semibold text-zinc-900">{asset.lastUsed}</p>
              </div>
            </div>
          )}

          {'retirementDate' in asset && (
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-zinc-50 p-3 rounded-lg">
                <p className="text-xs text-zinc-500 uppercase">Current Value</p>
                <p className="text-xl font-semibold text-zinc-900">{asset.currentValue}</p>
              </div>
              <div className="bg-amber-50 p-3 rounded-lg ring-1 ring-amber-200">
                <p className="text-xs text-amber-600 uppercase">Retirement</p>
                <p className="text-xl font-semibold text-amber-700">{asset.retirementDate}</p>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex justify-end pt-2 border-t border-zinc-100">
          <Button onClick={onClose} variant="outline" size="sm">Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function MaintenanceDetailsDialog({ 
  item, 
  onClose 
}: { 
  item: MaintenanceItem | null; 
  onClose: () => void 
}) {
  if (!item) return null;

  return (
    <Dialog open={!!item} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle>{item.asset}</DialogTitle>
          <DialogDescription>
            {item.type} • Priority: <span className="capitalize">{item.priority}</span>
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="bg-zinc-50 p-3 rounded-lg">
            <p className="text-xs text-zinc-500 uppercase">Due Date</p>
            <p className="text-xl font-semibold text-zinc-900">{item.dueDate}</p>
          </div>
        </div>
        
        <div className="flex justify-between pt-4 border-t border-zinc-100">
          <Button onClick={onClose} variant="outline" size="sm">Cancel</Button>
          <Button onClick={() => {
            toast.success("Maintenance request created successfully!");
            onClose();
          }} size="sm">Create Request</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
