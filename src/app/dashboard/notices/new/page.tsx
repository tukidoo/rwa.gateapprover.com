"use client";

import { useAddNotice } from "@/hooks/api/notice";
import { invalidateQuery } from "@/lib/query-client";
import { z } from "zod";
import { toast } from "sonner";
import { CATEGORY, PRIORITY, TARGET_AUDIENCE } from "@/constants/common";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
  FormItem,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

const addNoticeSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  category_id: z.enum(CATEGORY.map((item) => item.value)),
  priority: z.enum(PRIORITY.map((item) => item.value)),
  target_audience: z.enum(TARGET_AUDIENCE.map((item) => item.value)),
  target_units: z.array(z.number()),
  target_floors: z.array(z.number()),
  effective_dates: z.object({
    from: z.date(),
    to: z.date().optional(),
  }),
  is_pinned: z.boolean(),
  send_push_notification: z.boolean(),
  send_email: z.boolean(),
  send_sms: z.boolean(),
  attachments: z.array(z.string()).optional(),
});

const NewNoticePage = () => {
  const [targetUnits, setTargetUnits] = useState<string[]>([""]);
  const [targetFloors, setTargetFloors] = useState<string[]>([""]);

  const { mutate: addNotice, isPending } = useAddNotice({
    onSuccess: (data) => {
      toast.success(data.message);
      invalidateQuery({ queryKey: ["useGetAllNotices"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const form = useForm<z.infer<typeof addNoticeSchema>>({
    resolver: zodResolver(addNoticeSchema),
    defaultValues: {
      title: "",
      content: "",
      category_id: CATEGORY[0].value,
      priority: PRIORITY[0].value,
      target_audience: TARGET_AUDIENCE[0].value,
      target_units: [],
      target_floors: [],
      effective_dates: {
        from: new Date(),
        to: undefined,
      },
      is_pinned: false,
      send_push_notification: false,
      send_email: false,
      send_sms: false,
    },
  });

  const addTargetUnit = () => {
    setTargetUnits([...targetUnits, ""]);
  };

  const removeTargetUnit = (index: number) => {
    if (targetUnits.length > 1) {
      setTargetUnits(targetUnits.filter((_, i) => i !== index));
    }
  };

  const updateTargetUnit = (index: number, value: string) => {
    const updated = [...targetUnits];
    updated[index] = value;
    setTargetUnits(updated);
  };

  const addTargetFloor = () => {
    setTargetFloors([...targetFloors, ""]);
  };

  const removeTargetFloor = (index: number) => {
    if (targetFloors.length > 1) {
      setTargetFloors(targetFloors.filter((_, i) => i !== index));
    }
  };

  const updateTargetFloor = (index: number, value: string) => {
    const updated = [...targetFloors];
    updated[index] = value;
    setTargetFloors(updated);
  };

  const handleAddNotice = (data: z.infer<typeof addNoticeSchema>) => {
    addNotice({
      ...data,
      target_units: targetUnits
        .filter((unit) => unit.trim() !== "")
        .map(Number),
      target_floors: targetFloors
        .filter((floor) => floor.trim() !== "")
        .map(Number),
      effective_from: data.effective_dates.from.toISOString(),
      effective_until:
        data.effective_dates.to?.toISOString() ||
        data.effective_dates.from.toISOString(),
      attachments: data.attachments?.map((attachment) => ({
        url: attachment,
        filename: attachment,
        file_type: "image",
        file_size: 0,
        uploaded_at: new Date().toISOString(),
      })),
    });
  };

  return (
    <div className="max-w-xl mx-auto">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleAddNotice)}
          className="flex flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORY.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a priority" />
                    </SelectTrigger>
                    <SelectContent>
                      {PRIORITY.map((priority) => (
                        <SelectItem key={priority.value} value={priority.value}>
                          {priority.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="target_audience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Target Audience</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a target audience" />
                    </SelectTrigger>
                    <SelectContent>
                      {TARGET_AUDIENCE.map((target) => (
                        <SelectItem key={target.value} value={target.value}>
                          {target.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-4">
            <FormField
              control={form.control}
              name="target_units"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Units</FormLabel>
                  <div className="flex flex-col gap-2">
                    {targetUnits.map((unit, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <Input
                          type="number"
                          value={unit}
                          onChange={(e) =>
                            updateTargetUnit(index, e.target.value)
                          }
                          className="w-40"
                          placeholder="Enter unit number"
                        />
                        {index === targetUnits.length - 1 ? (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={addTargetUnit}
                            size="sm"
                          >
                            <Plus />
                          </Button>
                        ) : (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => removeTargetUnit(index)}
                            size="sm"
                          >
                            <Trash2 />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="target_floors"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Floors</FormLabel>
                  <div className="flex flex-col gap-2">
                    {targetFloors.map((floor, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <Input
                          type="number"
                          value={floor}
                          onChange={(e) =>
                            updateTargetFloor(index, e.target.value)
                          }
                          className="w-40"
                          placeholder="Enter floor number"
                        />
                        {index === targetFloors.length - 1 ? (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={addTargetFloor}
                            size="sm"
                          >
                            <Plus />
                          </Button>
                        ) : (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => removeTargetFloor(index)}
                            size="sm"
                          >
                            <Trash2 />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="effective_dates"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Effective Period</FormLabel>
                <FormControl>
                  <Calendar
                    mode="range"
                    selected={field.value}
                    onSelect={field.onChange}
                    className="rounded-md border"
                    numberOfMonths={2}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-4">
            <FormField
              control={form.control}
              name="is_pinned"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Is Pinned</FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="send_push_notification"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Send Push Notification</FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="send_email"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Send Email</FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="send_sms"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Send SMS</FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            className="w-fit mx-auto"
            type="submit"
            disabled={isPending || !form.formState.isValid}
          >
            {isPending ? "Creating..." : "Create Notice"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default NewNoticePage;
