import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/shared/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/Button";
import { Notification } from "@/shared/types";
import { toast } from "sonner";
import { relativeTime, getInitials } from "@/shared/lib/utils";
import { NotificationsAPI } from "../services/mock-api";
import { Avatar, AvatarFallback } from "@/shared/ui/avatar";
import { Badge } from "@/shared/ui/badge";
import { ScrollArea } from "@/shared/ui/scroll-area";
import {
  CheckCircle2,
  XCircle,
  Wrench,
  CalendarDays,
  ArrowRightLeft,
  ClipboardCheck,
  User,
  MapPin,
  Tag,
  Briefcase,
  AlertCircle,
  Clock,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ----------------------------------------------------------------------
// MOCK DATA GENERATORS FOR DETAILS
// ----------------------------------------------------------------------

const generateMockMetadata = (notification: Notification) => {
  return {
    assetName: "ThinkPad X1 Carbon Gen 10",
    assetTag: "AST-2023-0892",
    department: "Engineering",
    location: "Floor 3, Desk 312",
    assignedTo: "Priya Sharma",
    createdAt: new Date(new Date(notification.timestamp).getTime() - 86400000 * 2).toISOString(),
  };
};

const generateMockTimeline = (notification: Notification) => {
  return [
    { id: 1, title: "Event Initiated", time: relativeTime(new Date(new Date(notification.timestamp).getTime() - 86400000 * 2).toISOString()), icon: Clock },
    { id: 2, title: "System Validated", time: relativeTime(new Date(new Date(notification.timestamp).getTime() - 86400000).toISOString()), icon: CheckCircle2 },
    { id: 3, title: notification.title, time: relativeTime(notification.timestamp), icon: AlertCircle, current: true },
  ];
};

// ----------------------------------------------------------------------
// PREFERENCES DIALOG
// ----------------------------------------------------------------------

export function NotificationSettingsDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle>Notification Preferences</DialogTitle>
          <DialogDescription>Configure how and when you want to receive alerts.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {['Audit', 'Maintenance', 'Bookings', 'Transfers', 'Approvals', 'System'].map((setting) => (
            <div key={setting} className="flex items-center justify-between">
              <span className="text-sm font-medium text-zinc-900">{setting}</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="h-7 text-[10px]">Email</Button>
                <Button variant="outline" size="sm" className="h-7 text-[10px] bg-zinc-100">Push</Button>
              </div>
            </div>
          ))}
        </div>
        <DialogFooter className="border-t border-zinc-100 pt-3">
          <Button onClick={onClose} variant="outline" size="sm">Cancel</Button>
          <Button onClick={async () => {
            toast.loading("Saving preferences...", { id: "prefs" });
            await NotificationsAPI.savePreferences({});
            toast.success("Preferences saved successfully", { id: "prefs" });
            onClose();
          }} size="sm">Save Preferences</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ----------------------------------------------------------------------
// ACTION DIALOGS
// ----------------------------------------------------------------------

function AssignTechnicianDialog({ open, onClose, onSubmit }: { open: boolean; onClose: () => void; onSubmit: () => void }) {
  const [loading, setLoading] = useState(false);
  return (
    <Dialog open={open} onOpenChange={(val) => !val && !loading && onClose()}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle>Assign Technician</DialogTitle>
          <DialogDescription>Assign a maintenance technician to this request.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-xs font-medium text-zinc-700">Select Technician</label>
            <select className="w-full h-9 rounded-md border border-zinc-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
              <option>Mike Ross (HVAC Specialist)</option>
              <option>Sarah Chen (IT Hardware)</option>
              <option>David Kim (Facilities)</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-zinc-700">Priority</label>
            <select className="w-full h-9 rounded-md border border-zinc-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
              <option>High (SLA: 4h)</option>
              <option>Medium (SLA: 24h)</option>
              <option>Low (SLA: 72h)</option>
            </select>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose} variant="outline" size="sm" disabled={loading}>Cancel</Button>
          <Button onClick={async () => {
            setLoading(true);
            await onSubmit();
            setLoading(false);
            onClose();
          }} size="sm" disabled={loading}>
            {loading ? "Assigning..." : "Assign Technician"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ConfirmActionDialog({ open, onClose, onSubmit, title, description, actionText, isDestructive }: { open: boolean; onClose: () => void; onSubmit: () => void; title: string; description: string; actionText: string; isDestructive?: boolean }) {
  const [loading, setLoading] = useState(false);
  return (
    <Dialog open={open} onOpenChange={(val) => !val && !loading && onClose()}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4">
          <Button onClick={onClose} variant="outline" size="sm" disabled={loading}>Cancel</Button>
          <Button 
            onClick={async () => {
              setLoading(true);
              await onSubmit();
              setLoading(false);
              onClose();
            }} 
            size="sm" 
            variant={isDestructive ? "destructive" : "default"}
            disabled={loading}
          >
            {loading ? "Processing..." : actionText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ----------------------------------------------------------------------
// DETAILS SHEET (MAIN)
// ----------------------------------------------------------------------

export function NotificationDetailsSheet({ notification, onClose }: { notification: Notification | null; onClose: () => void }) {
  const [actionDialog, setActionDialog] = useState<{ type: string; props: any } | null>(null);

  if (!notification) return null;

  const meta = generateMockMetadata(notification);
  const timeline = generateMockTimeline(notification);

  const priorityColors: Record<string, string> = {
    critical: "bg-red-50 text-red-700 border-red-200",
    high: "bg-orange-50 text-orange-700 border-orange-200",
    medium: "bg-amber-50 text-amber-700 border-amber-200",
    low: "bg-zinc-100 text-zinc-700 border-zinc-200",
  };

  const typeConfig: Record<string, any> = {
    booking: { icon: CalendarDays, color: "text-blue-600", bg: "bg-blue-50" },
    maintenance: { icon: Wrench, color: "text-amber-600", bg: "bg-amber-50" },
    audit: { icon: ClipboardCheck, color: "text-indigo-600", bg: "bg-indigo-50" },
    approval: { icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
    transfer: { icon: ArrowRightLeft, color: "text-purple-600", bg: "bg-purple-50" },
    allocation: { icon: CheckCircle2, color: "text-blue-600", bg: "bg-blue-50" },
  };

  const TypeIcon = typeConfig[notification.type]?.icon || AlertCircle;
  const typeColor = typeConfig[notification.type]?.color || "text-zinc-600";
  const typeBg = typeConfig[notification.type]?.bg || "bg-zinc-100";

  const executeAction = async (actionId: string, apiCall: () => Promise<void>, successMsg: string) => {
    toast.loading(`Processing...`, { id: actionId });
    try {
      await apiCall();
      toast.success(successMsg, { id: actionId });
      onClose();
    } catch (e) {
      toast.error(`Failed to process action.`, { id: actionId });
    }
  };

  return (
    <>
      <Sheet open={!!notification} onOpenChange={(val) => !val && onClose()}>
        <SheetContent className="bg-white sm:max-w-[480px] w-full border-l border-zinc-200 p-0 flex flex-col shadow-2xl">
          <ScrollArea className="flex-1 h-full">
            <div className="p-6 sm:p-8 space-y-8">
              
              {/* Header Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={cn("capitalize px-2 py-0.5 text-[10px] font-medium border rounded-md", priorityColors[notification.priority])}>
                    {notification.priority} Priority
                  </Badge>
                  <Badge variant="outline" className="capitalize px-2 py-0.5 text-[10px] font-medium border rounded-md bg-zinc-50 text-zinc-600">
                    {notification.type}
                  </Badge>
                  {notification.read ? (
                    <Badge variant="outline" className="px-2 py-0.5 text-[10px] font-medium border rounded-md bg-zinc-50 text-zinc-500">Read</Badge>
                  ) : (
                    <Badge variant="outline" className="px-2 py-0.5 text-[10px] font-medium border rounded-md bg-blue-50 text-blue-700 border-blue-200">Unread</Badge>
                  )}
                </div>

                <div className="space-y-1.5">
                  <SheetTitle className="text-xl font-semibold text-zinc-950 leading-tight">
                    {notification.title}
                  </SheetTitle>
                  <SheetDescription className="text-sm text-zinc-500 flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    {relativeTime(notification.timestamp)}
                  </SheetDescription>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <Avatar className="h-8 w-8 border border-zinc-200">
                    <AvatarFallback className="bg-zinc-100 text-zinc-600 text-xs font-medium">
                      {getInitials(notification.actor.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-zinc-900 leading-none">{notification.actor.name}</span>
                    <span className="text-[11px] text-zinc-500 mt-1">Event Trigger</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-zinc-50/80 border border-zinc-200/60 rounded-xl p-4">
                <h4 className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-2">Description</h4>
                <p className="text-sm text-zinc-700 leading-relaxed">{notification.description}</p>
              </div>

              {/* Metadata Cards */}
              <div className="space-y-3">
                <h4 className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Related Entity Details</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="border border-zinc-200/70 rounded-lg p-3 bg-white">
                    <div className="flex items-center gap-1.5 text-zinc-500 mb-1">
                      <Tag className="h-3.5 w-3.5" />
                      <span className="text-xs font-medium">Asset Name</span>
                    </div>
                    <p className="text-sm font-medium text-zinc-900 truncate">{meta.assetName}</p>
                  </div>
                  <div className="border border-zinc-200/70 rounded-lg p-3 bg-white">
                    <div className="flex items-center gap-1.5 text-zinc-500 mb-1">
                      <Briefcase className="h-3.5 w-3.5" />
                      <span className="text-xs font-medium">Department</span>
                    </div>
                    <p className="text-sm font-medium text-zinc-900 truncate">{meta.department}</p>
                  </div>
                  <div className="border border-zinc-200/70 rounded-lg p-3 bg-white">
                    <div className="flex items-center gap-1.5 text-zinc-500 mb-1">
                      <MapPin className="h-3.5 w-3.5" />
                      <span className="text-xs font-medium">Location</span>
                    </div>
                    <p className="text-sm font-medium text-zinc-900 truncate">{meta.location}</p>
                  </div>
                  <div className="border border-zinc-200/70 rounded-lg p-3 bg-white">
                    <div className="flex items-center gap-1.5 text-zinc-500 mb-1">
                      <User className="h-3.5 w-3.5" />
                      <span className="text-xs font-medium">Assigned To</span>
                    </div>
                    <p className="text-sm font-medium text-zinc-900 truncate">{meta.assignedTo}</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <h4 className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Available Actions</h4>
                <div className="flex flex-col gap-2.5">
                  {notification.type === 'approval' || notification.type === 'transfer' ? (
                    <>
                      <Button onClick={() => setActionDialog({
                        type: 'confirm',
                        props: { title: "Approve Request", description: "Are you sure you want to approve this request?", actionText: "Approve", onSubmit: () => executeAction('approve', () => NotificationsAPI.approveRequest(notification.id), "Request approved.") }
                      })} className="w-full justify-start gap-2">
                        <CheckCircle2 className="h-4 w-4" /> Approve Request
                      </Button>
                      <Button onClick={() => setActionDialog({
                        type: 'confirm',
                        props: { title: "Reject Request", description: "Are you sure you want to reject this request? This action cannot be undone.", actionText: "Reject", isDestructive: true, onSubmit: () => executeAction('reject', () => NotificationsAPI.rejectRequest(notification.id), "Request rejected.") }
                      })} variant="outline" className="w-full justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50">
                        <XCircle className="h-4 w-4" /> Reject Request
                      </Button>
                    </>
                  ) : notification.type === 'booking' ? (
                    <>
                      <Button onClick={() => {}} className="w-full justify-start gap-2">
                        <CalendarDays className="h-4 w-4" /> View Booking Details
                      </Button>
                      <Button onClick={() => setActionDialog({
                        type: 'confirm',
                        props: { title: "Cancel Booking", description: "Are you sure you want to cancel this booking?", actionText: "Cancel Booking", isDestructive: true, onSubmit: () => executeAction('cancel', () => NotificationsAPI.rejectRequest(notification.id), "Booking cancelled.") }
                      })} variant="outline" className="w-full justify-start gap-2">
                        <XCircle className="h-4 w-4" /> Cancel Booking
                      </Button>
                    </>
                  ) : notification.type === 'maintenance' ? (
                    <>
                      <Button onClick={() => setActionDialog({
                        type: 'assign',
                        props: { onSubmit: () => executeAction('assign', () => NotificationsAPI.approveRequest(notification.id), "Technician assigned successfully.") }
                      })} className="w-full justify-start gap-2">
                        <Wrench className="h-4 w-4" /> Assign Technician
                      </Button>
                      <Button onClick={() => {}} variant="outline" className="w-full justify-start gap-2">
                        View Maintenance Request
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => {}} className="w-full justify-start gap-2">
                      Open Related Record
                    </Button>
                  )}
                </div>
              </div>

              {/* Activity Timeline */}
              <div className="space-y-4 pt-4 border-t border-zinc-100">
                <h4 className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Activity Timeline</h4>
                <div className="relative space-y-4 before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-zinc-200 before:to-transparent">
                  {timeline.map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        <div className={cn(
                          "flex items-center justify-center w-5 h-5 rounded-full border-2 bg-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2",
                          item.current ? "border-primary" : "border-zinc-300"
                        )}>
                          <div className={cn("w-1.5 h-1.5 rounded-full", item.current ? "bg-primary" : "bg-zinc-300")}></div>
                        </div>
                        <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] pl-3 md:pl-0">
                          <div className="flex flex-col">
                            <span className={cn("text-sm font-medium", item.current ? "text-zinc-900" : "text-zinc-500")}>{item.title}</span>
                            <span className="text-[11px] text-zinc-400 mt-0.5">{item.time}</span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Render Dynamic Action Dialog */}
      {actionDialog?.type === 'assign' && (
        <AssignTechnicianDialog
          open={!!actionDialog}
          onClose={() => setActionDialog(null)}
          {...actionDialog.props}
        />
      )}
      {actionDialog?.type === 'confirm' && (
        <ConfirmActionDialog
          open={!!actionDialog}
          onClose={() => setActionDialog(null)}
          {...actionDialog.props}
        />
      )}
    </>
  );
}
