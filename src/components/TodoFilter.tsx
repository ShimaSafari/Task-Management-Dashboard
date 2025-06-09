"use client";
import { User } from "@/lib/types";
import { useState } from "react";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TodoFilterType {
  users: User[];
  onChangeFilter: (filter: {
    completed: boolean | null;
    userIds: number[];
  }) => void;
}

const TodoFilter = ({ users, onChangeFilter }: TodoFilterType) => {
  const [completed, setComplete] = useState<boolean | null>(null);
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);

  // ------- updates status filter from select
  const handleChangeComplete = (value: string) => {
    const selectedStatus = value === "all" ? null : value === "completed";
    setComplete(selectedStatus);
    onChangeFilter({ completed: selectedStatus, userIds: selectedUserIds });
  };

  // --------- select user filter from drop down
  const handleChangeUser = (userId: number, checked: boolean) => {
    const selectedUser = checked
      ? [...selectedUserIds, userId]
      : selectedUserIds.filter((id) => id !== userId);
    setSelectedUserIds(selectedUser);
    onChangeFilter({ completed, userIds: selectedUser });
  };
  
  // --------- reset user filter
  const handleClearAllUsers = () => {
    setSelectedUserIds([]);
    onChangeFilter({ completed, userIds: [] });
  };
  return (
    <div className="flex gap-3 w-full">
      <Select onValueChange={handleChangeComplete}>
        <SelectTrigger className="w-1/2 md:w-32">
          <SelectValue placeholder="All Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Choose Status</SelectLabel>
            <SelectItem value="all">All Tasks</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="incompleted">Incompleted</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className={`w-1/2 sm:w-48 flex justify-start ${
              selectedUserIds.length == 0 && "text-muted-foreground"
            }`}
          >
            {selectedUserIds.length > 0
              ? `${selectedUserIds.length} User Selected`
              : "All Users"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-full sm:w-48">
          <DropdownMenuCheckboxItem onSelect={handleClearAllUsers}>
            All Users
          </DropdownMenuCheckboxItem>
          <DropdownMenuSeparator />
          {users.map((user) => (
            <DropdownMenuCheckboxItem
              key={user.id}
              checked={selectedUserIds.includes(user.id)}
              onCheckedChange={(checked) => handleChangeUser(user.id, checked)}
            >
              {user.name}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default TodoFilter;
