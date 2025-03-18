import React from 'react';
import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

interface TransactionData {
  amount: number; 
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

const TransactionConfirmationPopup: React.FC<TransactionConfirmationPopupProps> = ({ 
  popupData, 
  onConfirm, 
  onClose,
}) => {
  

  // Initialize form with default values from popupData
  const form = useForm({
    defaultValues: {
      amount: popupData?.amount || 0,
      date: popupData?.date || new Date(),
      description: popupData?.description || '',
      category: popupData?.category || '',
      type: popupData?.type || 'expense'
    }
  });


  if (!popupData) return null;

  

  return (
    <Dialog open={!!popupData} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
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
                name="amount"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">Số tiền</FormLabel>
                    <FormControl>
                      <div className="col-span-3 p-2  dark:bg-black bg-gray-100 rounded">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(field.value)}
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
                      <div className="col-span-3 p-2  dark:bg-black bg-gray-100 rounded">
                        {field.value instanceof Date 
                          ? field.value.toLocaleDateString('vi-VN') 
                          : new Date(field.value).toLocaleDateString('vi-VN')}
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
                      <div className="col-span-3 p-2  dark:bg-black bg-gray-100 rounded">
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
                      <div className="col-span-3 p-2  dark:bg-black bg-gray-100 rounded">
                        {field.value === 'income' ? 'Thu nhập' : 'Chi tiêu'}
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
                      <div className="col-span-3 p-2  dark:bg-black bg-gray-100 rounded">
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
          <Button 
            type="button"
            onClick={onConfirm}
            onKeyDown={(event) => event.key === "Enter" && onConfirm()}
          >
            Xác nhận
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
          >
            Hủy
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionConfirmationPopup;