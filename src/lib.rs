mod utils;

use wasm_bindgen::prelude::*;

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
enum TyreCompound {
    Soft,
    Medium,
    Hard,
}

struct TyreParams {
    offset_seconds: f32,
    degradation_per_lap_seconds: f32,
}

struct TyreOpts {
    soft: TyreParams,
    medium: TyreParams,
    hard: TyreParams,
}

// #[wasm_bindgen]
impl TyreParams {
    fn new(offset_seconds: f32, degradation_per_lap_seconds: f32) -> Self {
        TyreParams {
            offset_seconds,
            degradation_per_lap_seconds,
        }
    }

    // wasm interface stuff, feels like java
    pub fn offset_seconds(&self) -> f32 {
        self.offset_seconds
    }
    pub fn degradation_per_lap_seconds(&self) -> f32 {
        self.degradation_per_lap_seconds
    }
    pub fn set_offset_seconds(&mut self, new_offset_seconds: f32) {
        self.offset_seconds = new_offset_seconds;
    }
    pub fn set_degradation_per_lap_seconds(&mut self, new_degradation_per_lap_seconds: f32) {
        self.degradation_per_lap_seconds = new_degradation_per_lap_seconds;
    }
}

impl TyreOpts {
    fn get(&self, compound: TyreCompound) -> &TyreParams {
        match compound {
            TyreCompound::Soft => &self.soft,
            TyreCompound::Medium => &self.medium,
            TyreCompound::Hard => &self.hard,
        }
    }
}

pub struct ModelOpts {}

pub struct Model {
    base_lap_time_seconds: f32,
    pit_delta_seconds: f32,
    tyre_opts: TyreOpts,
}

impl Model {
    // T(a) = B + C + D(a - 1) where a is tyre_age_laps
    fn predicted_lap_time_seconds(&self, compound: TyreCompound, tyre_age_laps: u8) -> Option<f32> {
        match tyre_age_laps {
            0 => None,
            _ => {
                let tyre: &TyreParams = self.tyre_opts.get(compound);

                Some(
                    self.base_lap_time_seconds
                        + tyre.offset_seconds
                        + tyre.degradation_per_lap_seconds * (tyre_age_laps - 1) as f32,
                )
            }
        }
    }

    // summation: T_stint(n) = Summation where a=1 to n [B + C + D (a - 1)] where n is laps
    fn total_stint_time_summation_seconds(&self, compound: TyreCompound, laps: u8) -> Option<f32> {
        (1..=laps)
            .map(|l| self.predicted_lap_time_seconds(compound, l))
            .sum()
    }

    // T_stint(n) = n(B + C) + D * (n * (n - 1) / 2) where n is laps
    fn total_stint_time_seconds(&self, compound: TyreCompound, laps: u8) -> f32 {
        let n = laps as f32;
        let tyre: &TyreParams = self.tyre_opts.get(compound);

        n * (self.base_lap_time_seconds + tyre.offset_seconds)
            + tyre.degradation_per_lap_seconds * (n * (n - 1.0) / 2.0)
    }

    fn evaluate_strategy(&self, strat: Strategy) {}

    pub fn pit_delta_seconds(&self) -> f32 {
        self.pit_delta_seconds
    }

    pub fn set_pit_delta_seconds(&mut self, new_pit_delta_seconds: f32) {
        self.pit_delta_seconds = new_pit_delta_seconds;
    }
}

struct Stint {
    compound: TyreCompound,
    laps: u8,
}

struct Strategy {
    stints: Vec<Stint>,
}

impl Strategy {
    fn total_laps(&self) -> u8 {
        self.stints.iter().map(|s| s.laps).sum()
    }

    fn pit_stops(&self) -> usize {
        // std::cmp::max(0, self.stints.len() - 1) // can underflow if stints.len() is 0
        self.stints.len().saturating_sub(1)
    }
}

// #[wasm_bindgen]
// extern "C" {
//     fn alert(s: &str);
// }
//
// #[wasm_bindgen]
// pub fn greet() {
//     alert("Hello, visual-strategy!");
// }
