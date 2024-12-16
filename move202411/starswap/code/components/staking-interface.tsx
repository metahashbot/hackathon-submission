"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Flame, Droplets, Wind, Mountain } from "lucide-react";

const ELEMENT_DETAILS = {
  fire: {
    icon: Flame,
    color: "text-red-500",
    signs: ["Aries", "Leo", "Sagittarius"],
    benefit: "Increased staking rewards",
  },
  earth: {
    icon: Mountain,
    color: "text-amber-700",
    signs: ["Taurus", "Virgo", "Capricorn"],
    benefit: "Enhanced staking stability",
  },
  air: {
    icon: Wind,
    color: "text-sky-500",
    signs: ["Gemini", "Libra", "Aquarius"],
    benefit: "Faster unlock periods",
  },
  water: {
    icon: Droplets,
    color: "text-blue-500",
    signs: ["Cancer", "Scorpio", "Pisces"],
    benefit: "Extra governance weight",
  },
};

export function StakingInterface() {
  const [date, setDate] = useState<Date>();
  const [amount, setAmount] = useState("");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid md:grid-cols-2 gap-8">
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-6">Stake SUI</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Birth Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Select your birth date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Stake Amount</label>
              <Input
                type="number"
                placeholder="Enter SUI amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <Button className="w-full">Stake Now</Button>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-6">Element Bonuses</h2>
          <div className="space-y-4">
            {Object.entries(ELEMENT_DETAILS).map(([element, details]) => {
              const Icon = details.icon;
              return (
                <div key={element} className="flex items-start space-x-4">
                  <Icon className={`h-6 w-6 ${details.color} mt-1`} />
                  <div>
                    <h3 className="font-semibold capitalize">{element} Signs</h3>
                    <p className="text-sm text-muted-foreground">{details.signs.join(", ")}</p>
                    <p className="text-sm">{details.benefit}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}