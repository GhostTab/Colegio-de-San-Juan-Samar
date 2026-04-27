import { Fragment } from "react";
import { motion } from "framer-motion";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { subjects } from "@/lib/mockData";

const routeName: Record<string, string> = {
  grades: "Grades",
  subjects: "Subjects",
  dashboard: "Dashboard",
  lessons: "Lessons",
  quiz: "Activities",
  teacher: "Teacher Panel",
};

export default function AppBreadcrumbs() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const pathSegments = location.pathname.split("/").filter(Boolean);

  if (location.pathname === "/" || pathSegments.length === 0) {
    return null;
  }

  const grade = searchParams.get("grade");
  const subjectId = searchParams.get("subject");
  const subjectName = subjects.find((subject) => subject.id === subjectId)?.name;

  const crumbs = pathSegments.map((segment, index) => ({
    label: routeName[segment] ?? segment,
    href: `/${pathSegments.slice(0, index + 1).join("/")}`,
  }));

  if (grade && (location.pathname === "/subjects" || location.pathname === "/lessons")) {
    crumbs.push({
      label: `Grade ${grade}`,
      href: location.pathname,
    });
  }

  if (subjectName && location.pathname === "/lessons") {
    crumbs.push({
      label: subjectName,
      href: location.pathname,
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-16 z-40 border-b border-border/40 bg-background/70 backdrop-blur-xl"
    >
      <div className="mx-auto max-w-7xl px-4 py-2 sm:px-6 lg:px-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {crumbs.map((crumb, index) => {
              const isLast = index === crumbs.length - 1;
              return (
                <Fragment key={`${crumb.label}-${index}`}>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage className="font-semibold">{crumb.label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link to={crumb.href}>{crumb.label}</Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </motion.div>
  );
}
