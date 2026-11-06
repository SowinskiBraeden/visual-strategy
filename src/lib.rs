use wasm_bindgen::prelude::*;

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum TyreCompound {
    Soft,
    Medium,
    Hard,
    Intermediate,
    Wet,
}

pub struct TyreParams {
    offset_seconds: f32,
    degradation_per_lap_seconds: f32,
}

pub struct TyreOpts {
    soft: TyreParams,
    medium: TyreParams,
    hard: TyreParams,
    intermediate: TyreParams,
    wet: TyreParams,
}

impl TyreParams {
    pub fn new(offset_seconds: f32, degradation_per_lap_seconds: f32) -> Self {
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
            TyreCompound::Intermediate => &self.intermediate,
            TyreCompound::Wet => &self.wet,
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
    pub fn predicted_lap_time_seconds(
        &self,
        compound: TyreCompound,
        tyre_age_laps: u8,
    ) -> Option<f32> {
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

    // T_stint(n) = n(B + C) + D * (n * (n - 1) / 2) where n is laps
    fn total_stint_time_seconds(&self, compound: TyreCompound, laps: u8) -> Option<f32> {
        let n = laps as f32;
        let tyre: &TyreParams = self.tyre_opts.get(compound);

        Some(
            n * (self.base_lap_time_seconds + tyre.offset_seconds)
                + tyre.degradation_per_lap_seconds * (n * (n - 1.0) / 2.0),
        )
    }

    fn evaluate_strategy(&self, strategy: &Strategy) -> Option<StrategyTime> {
        if strategy.stints.is_empty() || strategy.stints.iter().any(|stint| stint.laps == 0) {
            return None;
        }

        let pit_loss_seconds = strategy.pit_stops() as f32 * self.pit_delta_seconds;
        let track_time_seconds: Option<f32> = strategy
            .stints
            .iter()
            .map(|s| self.total_stint_time_seconds(s.compound, s.laps))
            .sum();

        track_time_seconds.map(|track_time_seconds| StrategyTime {
            track_time_seconds,
            pit_loss_seconds,
        })
    }

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
    fn total_laps(&self) -> u16 {
        self.stints.iter().map(|s| u16::from(s.laps)).sum()
    }

    fn pit_stops(&self) -> usize {
        // std::cmp::max(0, self.stints.len() - 1) // can underflow if stints.len() is 0
        self.stints.len().saturating_sub(1)
    }
}

#[derive(Clone, Copy, Debug, PartialEq)]
struct StrategyTime {
    track_time_seconds: f32,
    pit_loss_seconds: f32,
}

#[wasm_bindgen]
pub struct PresetComparison {
    one_stop_track_seconds: f32,
    one_stop_pit_seconds: f32,
    two_stop_track_seconds: f32,
    two_stop_pit_seconds: f32,
}

#[wasm_bindgen]
impl PresetComparison {
    #[wasm_bindgen(getter)]
    pub fn one_stop_track_seconds(&self) -> f32 {
        self.one_stop_track_seconds
    }
    #[wasm_bindgen(getter)]
    pub fn one_stop_pit_seconds(&self) -> f32 {
        self.one_stop_pit_seconds
    }
    #[wasm_bindgen(getter)]
    pub fn one_stop_total_seconds(&self) -> f32 {
        self.one_stop_track_seconds + self.one_stop_pit_seconds
    }
    #[wasm_bindgen(getter)]
    pub fn two_stop_track_seconds(&self) -> f32 {
        self.two_stop_track_seconds
    }
    #[wasm_bindgen(getter)]
    pub fn two_stop_pit_seconds(&self) -> f32 {
        self.two_stop_pit_seconds
    }
    #[wasm_bindgen(getter)]
    pub fn two_stop_total_seconds(&self) -> f32 {
        self.two_stop_track_seconds + self.two_stop_pit_seconds
    }
    #[wasm_bindgen(getter)]
    pub fn winner(&self) -> String {
        if self.one_stop_total_seconds() <= self.two_stop_total_seconds() {
            "One stop".into()
        } else {
            "Two stop".into()
        }
    }
    #[wasm_bindgen(getter)]
    pub fn winning_margin_seconds(&self) -> f32 {
        (self.one_stop_total_seconds() - self.two_stop_total_seconds()).abs()
    }
}

fn compound(value: u8) -> Result<TyreCompound, JsValue> {
    match value {
        0 => Ok(TyreCompound::Soft),
        1 => Ok(TyreCompound::Medium),
        2 => Ok(TyreCompound::Hard),
        _ => Err(JsValue::from_str("unknown tyre compound")),
    }
}

fn model(pit_delta_seconds: f32) -> Model {
    Model {
        base_lap_time_seconds: 90.0,
        pit_delta_seconds,
        tyre_opts: TyreOpts {
            soft: TyreParams::new(0.0, 0.12),
            medium: TyreParams::new(0.6, 0.07),
            hard: TyreParams::new(1.2, 0.04),
            intermediate: TyreParams::new(4.0, 0.08),
            wet: TyreParams::new(8.0, 0.10),
        },
    }
}

#[wasm_bindgen]
pub fn compare_strategies(
    pit_delta_seconds: f32,
    one_first: u8,
    one_second: u8,
    one_stop_lap: u8,
    two_first: u8,
    two_second: u8,
    two_third: u8,
    two_first_stop_lap: u8,
    two_second_stop_lap: u8,
) -> Result<PresetComparison, JsValue> {
    if !pit_delta_seconds.is_finite() || pit_delta_seconds < 0.0 {
        return Err(JsValue::from_str("pit delta must be a non-negative number"));
    }
    if !(1..50).contains(&one_stop_lap)
        || two_first_stop_lap == 0
        || two_first_stop_lap >= two_second_stop_lap
        || two_second_stop_lap >= 50
    {
        return Err(JsValue::from_str(
            "pit stops must be ordered within the 50-lap race",
        ));
    }

    let model = model(pit_delta_seconds);
    let one_stop = Strategy {
        stints: vec![
            Stint {
                compound: compound(one_first)?,
                laps: one_stop_lap,
            },
            Stint {
                compound: compound(one_second)?,
                laps: 50 - one_stop_lap,
            },
        ],
    };
    let two_stop = Strategy {
        stints: vec![
            Stint {
                compound: compound(two_first)?,
                laps: two_first_stop_lap,
            },
            Stint {
                compound: compound(two_second)?,
                laps: two_second_stop_lap - two_first_stop_lap,
            },
            Stint {
                compound: compound(two_third)?,
                laps: 50 - two_second_stop_lap,
            },
        ],
    };

    const RACE_LAPS: u16 = 50;
    if one_stop.total_laps() != RACE_LAPS || two_stop.total_laps() != RACE_LAPS {
        return Err(JsValue::from_str("strategy does not cover the 50-lap race"));
    }

    let one = model
        .evaluate_strategy(&one_stop)
        .ok_or_else(|| JsValue::from_str("one-stop preset is invalid"))?;
    let two = model
        .evaluate_strategy(&two_stop)
        .ok_or_else(|| JsValue::from_str("two-stop preset is invalid"))?;

    Ok(PresetComparison {
        one_stop_track_seconds: one.track_time_seconds,
        one_stop_pit_seconds: one.pit_loss_seconds,
        two_stop_track_seconds: two.track_time_seconds,
        two_stop_pit_seconds: two.pit_loss_seconds,
    })
}

/// Compare the default strategies used when the playground first opens.
#[wasm_bindgen]
pub fn compare_presets(pit_delta_seconds: f32) -> Result<PresetComparison, JsValue> {
    compare_strategies(pit_delta_seconds, 1, 2, 25, 0, 1, 2, 15, 33)
}

#[cfg(test)]
mod tests {
    use super::*;

    fn model() -> Model {
        Model {
            base_lap_time_seconds: 90.0,
            pit_delta_seconds: 20.0,
            tyre_opts: TyreOpts {
                soft: TyreParams::new(0.0, 0.1),
                medium: TyreParams::new(0.5, 0.05),
                hard: TyreParams::new(1.0, 0.02),
                intermediate: TyreParams::new(4.0, 0.1),
                wet: TyreParams::new(8.0, 0.1),
            },
        }
    }

    #[test]
    fn evaluation_separates_track_and_pit_time_and_borrows_strategy() {
        let strategy = Strategy {
            stints: vec![
                Stint {
                    compound: TyreCompound::Soft,
                    laps: 2,
                },
                Stint {
                    compound: TyreCompound::Medium,
                    laps: 2,
                },
            ],
        };
        let first = model().evaluate_strategy(&strategy).unwrap();
        let second = model().evaluate_strategy(&strategy).unwrap();
        assert_eq!(first, second);
        assert_eq!(first.pit_loss_seconds, 20.0);
        assert!(first.track_time_seconds > first.pit_loss_seconds);
        assert_eq!(
            first.track_time_seconds + first.pit_loss_seconds,
            first.track_time_seconds + 20.0
        );
    }

    #[test]
    fn empty_and_zero_lap_strategies_are_invalid() {
        assert!(model()
            .evaluate_strategy(&Strategy { stints: vec![] })
            .is_none());
        assert!(model()
            .evaluate_strategy(&Strategy {
                stints: vec![Stint {
                    compound: TyreCompound::Soft,
                    laps: 0
                },]
            })
            .is_none());
    }

    #[test]
    fn total_laps_uses_a_wider_type() {
        let strategy = Strategy {
            stints: vec![
                Stint {
                    compound: TyreCompound::Soft,
                    laps: 200,
                },
                Stint {
                    compound: TyreCompound::Hard,
                    laps: 100,
                },
            ],
        };
        assert_eq!(strategy.total_laps(), 300);
    }
}
