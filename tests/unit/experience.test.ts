import { describe, expect, it } from "vitest";
import { experiences } from "@/data/experience";

describe("V2 grouped professional experience catalog", () => {
  it("lists Berijalan Techno Center first in reverse-chronological order with legal entity & group metadata", () => {
    const professional = experiences.filter((e) => e.category === "professional");
    expect(professional.length).toBeGreaterThanOrEqual(4);

    const top = professional[0];
    expect(top.organization).toContain("Berijalan Techno Center");
    expect(top.legalEntity).toBe("PT Cipta Sedaya Digital Indonesia");
    expect(top.corporateGroup).toContain("Astra Credit Companies");
    expect(top.website).toBe("https://berijalan.co.id/");
    expect(top.endDate).toBe("2026-10");
  });

  it("groups both Freelance and Bootcamp / Internship-equivalent roles inside one Berijalan entry", () => {
    const berijalan = experiences.find((e) => e.id === "berijalan-acc");
    expect(berijalan).toBeDefined();
    expect(berijalan?.roles).toHaveLength(2);

    const [freelance, trainee] = berijalan!.roles!;
    expect(freelance.title).toContain("Software Quality Control Engineer");
    expect(freelance.employmentType).toBe("freelance");
    expect(freelance.startDate).toBe("2026-07");
    expect(freelance.endDate).toBe("2026-10");

    expect(trainee.title).toContain("Trainee");
    expect(trainee.employmentType).toBe("bootcamp");
    expect(trainee.employmentLabel).toContain("Bootcamp / Internship-equivalent");
    expect(trainee.startDate).toBe("2026-03");
    expect(trainee.endDate).toBe("2026-07");

    // Completed roles must not claim current employment
    expect(freelance.dateRange.toLowerCase()).not.toContain("present");
    expect(trainee.dateRange.toLowerCase()).not.toContain("present");
  });

  it("sorts professional companies reverse-chronologically by endDate", () => {
    const professional = experiences.filter((e) => e.category === "professional");
    for (let i = 1; i < professional.length; i++) {
      const prev = professional[i - 1].endDate ?? "";
      const curr = professional[i].endDate ?? "";
      expect(prev >= curr).toBe(true);
    }
  });

  it("embeds the three Berijalan selected projects as non-interactive informational entries", () => {
    const berijalan = experiences.find((e) => e.id === "berijalan-acc");
    expect(berijalan?.projectIds).toBeUndefined();
    expect(berijalan?.selectedProjects?.map((p) => p.title)).toEqual([
      "Archer Upgrade",
      "STNK Alignment",
      "Advanced Joint Finance Parameter",
    ]);
    expect(berijalan?.selectedProjects?.[0].description).toContain("Cypress");
    expect(berijalan?.selectedProjects?.[0].description).toContain("Jenkins");
    expect(berijalan?.selectedProjects?.[1].description).toContain("AOL UniPaaS");
    expect(berijalan?.selectedProjects?.[1].description).toContain("Magic xpa");
    expect(berijalan?.selectedProjects?.[2].description).toContain("Manual testing");
    expect(berijalan?.selectedProjects?.[2].description).toContain("AOL UniPaaS");

    const joined = JSON.stringify(berijalan);
    expect(joined).toContain("AOL UniPaaS");
    expect(joined).toContain("Magic xpa");
    expect(joined).toMatch(/joint financing/i);
    expect(joined).not.toMatch(/Magic XPA|MagicXPA|Unipass/);
  });
});
