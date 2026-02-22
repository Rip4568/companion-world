export const getTexturePath = (element: string): string => {
  const map: Record<string, string> = {
    fire: "/assets/no-bg/monster_fire_concept_1771723381562-removebg-preview (1).png",
    water: "/assets/monster_water_concept_1771723397494.png",
    earth:
      "/assets/no-bg/monster_earth_concept_1771723411624-removebg-preview.png",
    plant:
      "/assets/no-bg/monster_plant_concept_1771723427171-removebg-preview.png",
    ice: "/assets/no-bg/monster_frost-removebg-preview.png",
    electric:
      "/assets/no-bg/monster_electric_concept_1771723456331-removebg-preview.png",
    lava: "/assets/no-bg/monster_lava_concept_1771721196539-removebg-preview.png",
    swamp: "/assets/monster_swamp_concept_1771721212316.png",
    magma:
      "/assets/no-bg/monster_magma_concept_1771723471450-removebg-preview.png",
    nature:
      "/assets/no-bg/monster_nature_concept_1771723486945-removebg-preview.png",
    plasma: "/assets/monster_plasma.png",
    storm: "/assets/monster_storm.png",
    ash: "/assets/no-bg/monster_ash-removebg-preview.png",
    spore: "/assets/monster_spore.png",
    frost: "/assets/no-bg/monster_frost-removebg-preview.png",
    celestial: "/assets/no-bg/god_celestial-removebg-preview.png",
    cosmic: "/assets/no-bg/god_cosmic-removebg-preview.png",
    abyssal: "/assets/no-bg/god_abyssal-removebg-preview.png",
  };
  return map[element] || "";
};

export const getElementColor = (element: string): string => {
  const colorMap: Record<string, string> = {
    fire: "#ef4444",
    water: "#3b82f6",
    earth: "#8b4513",
    plant: "#22c56e",
    ice: "#7dd3fc",
    electric: "#eab308",
    lava: "#dc2626",
    swamp: "#166534",
    magma: "#991b1b",
    nature: "#10b981",
    plasma: "#fb923c",
    storm: "#60a5fa",
    ash: "#4b5563",
    spore: "#d946ef",
    frost: "#a5f3fc",
    celestial: "#fef08a",
    cosmic: "#c084fc",
    abyssal: "#4c1d95",
    normal: "#ffffff",
  };
  return colorMap[element] || "#ffffff";
};
