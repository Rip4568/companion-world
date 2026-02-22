import type { ElementType, Companion } from "../../store/useCompanionStore";

export const determineOffspringElement = (
  element1: ElementType,
  element2: ElementType,
): ElementType => {
  // Mutações baseadas no Game Design Document
  if (
    (element1 === "fire" && element2 === "ice") ||
    (element1 === "ice" && element2 === "fire")
  )
    return "lava";
  if (
    (element1 === "water" && element2 === "earth") ||
    (element1 === "earth" && element2 === "water")
  )
    return "swamp";
  if (
    (element1 === "fire" && element2 === "earth") ||
    (element1 === "earth" && element2 === "fire")
  )
    return "magma";
  if (
    (element1 === "plant" && element2 === "water") ||
    (element1 === "water" && element2 === "plant")
  )
    return "nature";

  // Se não houver mutação específica, herda um dos pais aleatoriamente
  return Math.random() > 0.5 ? element1 : element2;
};

export const calculateOffspringStats = (
  parent1: Companion,
  parent2: Companion,
) => {
  // Atributos base são a média calculada dos pais
  const baseHp = (parent1.maxHp + parent2.maxHp) / 2;
  const baseAtk = (parent1.atk + parent2.atk) / 2;
  const baseDef = (parent1.def + parent2.def) / 2;

  // RNG Mutação: Entre 0.8x e 1.3x o potencial base (até +30% mais forte ou -20% mais fraco)
  const mutator = () => 0.8 + Math.random() * 0.5;

  return {
    maxHp: Math.floor(baseHp * mutator()),
    atk: Math.floor(baseAtk * mutator()),
    def: Math.floor(baseDef * mutator()),
  };
};
