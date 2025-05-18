import React, { useState } from "react";
import { Search, RefreshCw, Star, TrendingUp } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface SearchInterfaceProps {
  onSearch: (
    category: string,
    count: number,
    searchType?: string,
    minStars?: number,
  ) => void;
  isLoading?: boolean;
  defaultCategory?: string;
  defaultCount?: number;
  defaultMinStars?: number;
}

const SearchInterface = ({
  onSearch,
  isLoading = false,
  defaultCategory = "AI",
  defaultCount = 5,
  defaultMinStars = 0,
}: SearchInterfaceProps) => {
  const [category, setCategory] = useState<string>(defaultCategory);
  const [count, setCount] = useState<string>(defaultCount.toString());
  const [searchType, setSearchType] = useState<string>("category");
  const [minStars, setMinStars] = useState<number>(defaultMinStars);

  const handleSearch = () => {
    onSearch(category, parseInt(count), searchType, minStars);
  };

  const handleRefresh = () => {
    handleSearch();
  };

  const handleSearchTypeChange = (value: string) => {
    setSearchType(value);
    if (value === "top-stars") {
      setCategory("top-stars");
      setCount("10");
      const topStarsMinimum = 10000;
      setMinStars(topStarsMinimum);
      onSearch("top-stars", 10, "top-stars", topStarsMinimum);
    }
  };

  return (
    <div className="w-full bg-gradient-to-r from-card/95 to-card/90 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-primary/10 relative overflow-hidden">
      <div className="absolute -top-12 -right-12 w-40 h-40 bg-primary/10 rounded-full filter blur-2xl"></div>
      <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-secondary/15 rounded-full filter blur-2xl"></div>

      <Tabs
        defaultValue="category"
        value={searchType}
        onValueChange={handleSearchTypeChange}
        className="mb-4"
      >
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="category" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Category Search
          </TabsTrigger>
          <TabsTrigger value="top-stars" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            Top Starred
          </TabsTrigger>
        </TabsList>

        <TabsContent value="category" className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 space-y-2">
              <Label htmlFor="category">Category</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="category"
                  placeholder="Search category..."
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="w-full md:w-48 space-y-2">
              <Label htmlFor="count">Repository Count</Label>
              <Select value={count} onValueChange={(value) => setCount(value)}>
                <SelectTrigger id="count">
                  <SelectValue placeholder="Select count" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 repositories</SelectItem>
                  <SelectItem value="10">10 repositories</SelectItem>
                  <SelectItem value="15">15 repositories</SelectItem>
                  <SelectItem value="20">20 repositories</SelectItem>
                  <SelectItem value="25">25 repositories</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-full md:w-48 space-y-2">
              <Label htmlFor="minStars">Minimum Stars</Label>
              <div className="relative">
                <Star className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="minStars"
                  type="number"
                  placeholder="Min stars..."
                  value={minStars || ""}
                  onChange={(e) =>
                    setMinStars(Math.max(0, parseInt(e.target.value) || 0))
                  }
                  className="pl-10"
                  min="0"
                />
              </div>
            </div>

            <div className="flex gap-2 w-full md:w-auto">
              <Button
                onClick={handleSearch}
                className="flex-1 md:flex-none"
                disabled={isLoading}
              >
                Search
              </Button>
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={isLoading}
                className="flex-1 md:flex-none"
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="top-stars" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-lg font-medium">
                Top 10 Starred Repositories
              </h3>
              <p className="text-sm text-muted-foreground">
                Showing the most starred repositories on GitHub
              </p>
            </div>
            <Badge variant="outline" className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              Trending
            </Badge>
          </div>

          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={isLoading}
              className="flex-none"
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SearchInterface;
