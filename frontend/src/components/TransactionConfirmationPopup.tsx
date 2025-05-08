import { forwardRef } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter, 
  DialogClose
} from "@/components/ui/dialog";

interface TransactionData {
  money: number;
  date: Date;
  description: string;
  category: string;
  type: string;
}

interface TransactionConfirmationPopupProps {
  popupData: TransactionData | null;
  onConfirm: () => void;
  onClose: () => void;
}

// ✅ Wrap with forwardRef to fix ref-related issues in Radix UI
const TransactionConfirmationPopup = forwardRef<HTMLDivElement, TransactionConfirmationPopupProps>(
  ({ popupData, onConfirm, onClose }, ref) => {
    const form = useForm({
      defaultValues: {
        money: popupData?.money || 0,
        date: popupData?.date || new Date(),
        description: popupData?.description || '',
        category: popupData?.category || '',
        type: popupData?.type || 'expense'
      }
    });

    if (!popupData) { return null; }

    console.log(popupData);
    

    return (
      <Dialog open={!!popupData} onOpenChange={onClose}>
        <DialogContent ref={ref} className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Xác nhận giao dịch</DialogTitle>
            <DialogDescription>
              Vui lòng xác nhận các thông tin giao dịch dưới đây.
            </DialogDescription>
          </DialogHeader>

          <FormProvider {...form}>
            <Form {...form}>
              <div className="grid gap-4 py-4">
                <FormField
                  control={form.control}
                  name="money"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-4 items-center gap-4">
                      <FormLabel className="text-right">Số tiền</FormLabel>
                      <FormControl>
                        <div className="col-span-3 p-2 dark:bg-black bg-gray-100 rounded">
                          {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(field.value)}
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-4 items-center gap-4">
                      <FormLabel className="text-right">Ngày</FormLabel>
                      <FormControl>
                        <div className="col-span-3 p-2 dark:bg-black bg-gray-100 rounded">
                          {field.value instanceof Date
                            ? field.value.toLocaleDateString("en-GB")
                            : new Date(field.value).toLocaleDateString("en-GB")}
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-4 items-center gap-4">
                      <FormLabel className="text-right">Mô tả</FormLabel>
                      <FormControl>
                        <div className="col-span-3 p-2 dark:bg-black bg-gray-100 rounded">
                          {field.value}
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-4 items-center gap-4">
                      <FormLabel className="text-right">Loại</FormLabel>
                      <FormControl>
                        <div className="col-span-3 p-2 dark:bg-black bg-gray-100 rounded">
                          {field.value}
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-4 items-center gap-4">
                      <FormLabel className="text-right">Danh mục</FormLabel>
                      <FormControl>
                        <div className="col-span-3 p-2 dark:bg-black bg-gray-100 rounded">
                          {field.value}
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </Form>
          </FormProvider>

          <DialogFooter>
            <Button type="button" onClick={onConfirm} onKeyDown={(event) => event.key === "Enter" && onConfirm()}>
              <span className="text-black ">Xác nhận</span>
            </Button>
            <Button type="button" onClick={onClose}>
              <span className="text-black ">Hủy</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
);

export default TransactionConfirmationPopup;
