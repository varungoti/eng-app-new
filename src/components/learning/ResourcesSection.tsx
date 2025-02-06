import React from 'react';
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Resource {
  id: string;
  title: string;
  type: string;
  url: string;
  size: string;
}

const resources: Resource[] = [
  {
    id: "1",
    title: "English Grammar Guide",
    type: "PDF",
    url: "/resources/grammar-guide.pdf",
    size: "2.4 MB"
  },
  {
    id: "2",
    title: "Vocabulary Workbook",
    type: "PDF",
    url: "/resources/vocabulary-workbook.pdf",
    size: "3.1 MB"
  },
  {
    id: "3",
    title: "Reading Comprehension Exercises",
    type: "PDF",
    url: "/resources/reading-exercises.pdf",
    size: "1.8 MB"
  }
];

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

export function ResourcesSection() {
  return (
    <motion.div
      variants={itemVariants}
      className="w-full"
    >
      <Card className={cn(
        "bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20",
        "backdrop-blur-sm shadow-xl"
      )}>
        <CardHeader>
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-orange-500" />
            <CardTitle>Learning Resources</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {resources.map((resource) => (
              <motion.div
                key={resource.id}
                className="flex items-center justify-between p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                    <FileText className="h-5 w-5 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="font-medium">{resource.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {resource.type} • {resource.size}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-orange-500 hover:text-orange-600 hover:bg-orange-100 dark:hover:bg-orange-900/30"
                  onClick={() => window.open(resource.url, '_blank')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
} 