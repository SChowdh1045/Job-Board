type BadgeProps = {
    jobType: string;
  }
  
  export default function Badge({ jobType }: BadgeProps) {
    return (
      <div className="rounded border bg-muted px-2 py-0.5 text-sm font-medium text-muted-foreground">
        {jobType}
      </div>
    );
  }