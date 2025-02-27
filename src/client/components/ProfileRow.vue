<template>
  <tr>
    <td>
      <div v-if="!editing">{{ profile.profile }}</div>
      <div v-else>
        <input
          class="input"
          type="text"
          v-model="name"
          placeHolder="profile name"
        />
      </div>
    </td>
    <td>
      <div class="is-family-code" v-if="!editing">
        {{ lamponHour }}:{{ lamponMinute }}
      </div>
      <div v-else>
        <input class="input" type="time" v-model="lampstart" />
      </div>
    </td>
    <td>
      <div class="is-family-code" v-if="!editing">
        {{ durationWithUnits }}
      </div>
      <div v-else>
        <input
          class="input"
          type="number"
          v-model="lampduration"
          min="0"
          max="24"
          size="2"
        />
      </div>
    </td>
    <td v-if="!editing">
      <div class="field is-grouped">
        <target
          icon="thermometer-half"
          :value="dayTemperature"
          :precision="1"
          :units="unitsWithDegree"
          size="small"
          color="warning"
        />
        <target
          icon="tint"
          :value="dayHumidity"
          :precision="0"
          units="%"
          size="small"
          color="warning"
        />
        <target
          icon="cloud"
          :value="dayPressure"
          :precision="1"
          units="hPa"
          size="small"
          color="warning"
        />
      </div>
    </td>
    <td v-if="editing">
      <div class="field is-grouped">
        <div class="control has-icons-left">
          <input
            class="input"
            type="number"
            v-model="lampontemperature"
            min="lampMin"
            max="lampMax"
            size="4"
            step="0.1"
          />
          <span class="icon is-left">
            <font-awesome-icon icon="thermometer-half" class="is-left" />
          </span>
        </div>
        <div class="control has-icons-left">
          <input
            class="input"
            type="number"
            v-model="lamponhumidity"
            min="0"
            max="100"
            size="2"
          />
          <span class="icon is-left">
            <font-awesome-icon icon="tint" class="is-left" />
          </span>
        </div>
      </div>
    </td>
    <td v-if="!editing">
      <div class="field is-grouped">
        <target
          icon="thermometer-half"
          :value="nightTemperature"
          :precision="1"
          :units="unitsWithDegree"
          size="small"
          color="info"
        />
        <target
          icon="tint"
          :value="nightHumidity"
          :precision="0"
          units="%"
          size="small"
          color="info"
        />
        <target
          icon="cloud"
          :value="nightPressure"
          :precision="1"
          units="hPa"
          size="small"
          color="info"
        />
      </div>
    </td>
    <td v-if="editing">
      <div class="field is-grouped">
        <div class="control has-icons-left">
          <input
            class="input"
            type="number"
            v-model="lampofftemperature"
            min="tempMin"
            max="tempMax"
            step="0.1"
            size="4"
          />
          <span class="icon is-left">
            <font-awesome-icon icon="thermometer-half" class="is-left" />
          </span>
        </div>
        <div class="control has-icons-left">
          <input
            class="input"
            type="number"
            v-model="lampoffhumidity"
            min="0"
            max="100"
            size="2"
          />
          <span class="icon is-left">
            <font-awesome-icon icon="tint" class="is-left" />
          </span>
        </div>
      </div>
    </td>
    <td>
      <edit-controls
        @on-edit="editable"
        @on-save="save"
        @on-destroy="destroy"
        @on-cancel="cancel"
      />
    </td>
  </tr>
</template>

<script lang="ts">
import Vue from "vue";
import { mapActions } from "vuex";
import Target from "@/components/Target.vue";
import EditControls from "@/components/EditControls.vue";
import {
  celsius2fahrenheit,
  celsius2kelvin,
  fahrenheit2celsius,
  kelvin2celsius,
  vaporPressureDeficit
} from "../../shared/utils";
import { Profile } from "@/store/profiles/types";

const ProfileRow = Vue.extend({
  props: {
    profile: Profile,
    units: String
  },

  data() {
    const start = this.profile.lampstart.split(":");
    let hourInt = parseInt(start[0]);
    if (hourInt < 0) {
      hourInt = 24 + hourInt;
    }
    let hourString;
    if (hourInt < 10) {
      hourString = "0" + hourInt;
    } else {
      hourString = hourInt.toString();
    }

    let lampon = this.profile.lampontemperature;
    let lampoff = this.profile.lampofftemperature;

    if (this.units === "F") {
      lampon = celsius2fahrenheit(lampon);
      lampoff = celsius2fahrenheit(lampoff);
    } else if (this.units === "K") {
      lampon = celsius2kelvin(lampon);
      lampoff = celsius2kelvin(lampoff);
    }

    return {
      name: this.profile.profile,
      lampstart: `${hourString}:${start[1]}:00`,
      lampduration: this.profile.lampduration["hours"],
      lampontemperature: lampon,
      lampofftemperature: lampoff,
      lamponhumidity: this.profile.lamponhumidity,
      lampoffhumidity: this.profile.lampoffhumidity,
      editing: false
    };
  },

  components: {
    EditControls,
    Target
  },

  computed: {
    durationWithUnits(): string {
      return this.profile.lampduration["hours"] + "hrs";
    },

    unitsWithDegree(): string {
      return "°" + this.units;
    },

    lamponMinute(): string {
      const start = this.profile.lampstart.split(":");
      return start[1];
    },

    lamponHour(): string {
      const start = this.profile.lampstart.split(":");
      const hour = parseInt(start[0]);

      if (hour < 0) {
        return (24 + hour).toString();
      } else if (hour < 10) {
        return "0" + hour;
      } else {
        return hour.toString();
      }
    },

    dayTemperature(): number {
      if (this.units === "F") {
        return celsius2fahrenheit(this.profile.lampontemperature);
      } else if (this.units === "K") {
        return celsius2kelvin(this.profile.lampontemperature);
      }

      return this.profile.lampontemperature;
    },

    nightTemperature(): number {
      if (this.units === "F") {
        return celsius2fahrenheit(this.profile.lampofftemperature);
      } else if (this.units === "K") {
        return celsius2kelvin(this.profile.lampofftemperature);
      }

      return this.profile.lampofftemperature;
    },

    dayHumidity(): number {
      return this.profile.lamponhumidity;
    },

    nightHumidity(): number {
      return this.profile.lampoffhumidity;
    },

    lampMin(): number {
      let min = 15;
      if (this.units === "F") {
        min = celsius2fahrenheit(min);
      } else if (this.units === "K") {
        min = celsius2kelvin(min);
      }

      return min;
    },

    lampMax(): number {
      let max = 30;
      if (this.units === "F") {
        max = celsius2fahrenheit(max);
      } else if (this.units === "K") {
        max = celsius2kelvin(max);
      }

      return max;
    },

    dayPressure(): number {
      return (
        vaporPressureDeficit(
          this.profile.lampontemperature,
          0.6,
          this.profile.lamponhumidity / 100
        ) / 1000
      );
    },

    nightPressure(): number {
      return (
        vaporPressureDeficit(
          this.profile.lampofftemperature,
          -0.6,
          this.profile.lampoffhumidity / 100
        ) / 1000
      );
    }
  },

  methods: {
    editable() {
      this.editing = true;
    },

    save() {
      const start = this.lampstart.split(":");
      console.log("start", start);
      let hourInt = parseInt(start[0]);
      if (hourInt > 24) {
        hourInt = hourInt - 24;
      }
      console.log("hour int", hourInt);

      let hourString;
      if (hourInt < 10) {
        hourString = "0" + hourInt;
      } else {
        hourString = hourInt.toString();
      }
      console.log("hour string", hourString);

      let ontemp = this.lampontemperature;
      let offtemp = this.lampofftemperature;
      if (this.units === "F") {
        ontemp = fahrenheit2celsius(ontemp);
        offtemp = fahrenheit2celsius(offtemp);
      } else if (this.units === "K") {
        ontemp = kelvin2celsius(ontemp);
        offtemp = kelvin2celsius(offtemp);
      }

      console.log("lampstart", `${hourString}:${start[1]}`);
      const profile = {
        id: this.profile.id,
        profile: this.name,
        lampstart: `${hourString}:${start[1]}`,
        lampduration: `${this.lampduration} hours`,
        lampontemperature: ontemp,
        lamponhumidity: this.lamponhumidity,
        lampofftemperature: offtemp,
        lampoffhumidity: this.lampoffhumidity
      };

      this.edit(profile);
      this.editing = false;
    },

    destroy() {
      this.remove(this.profile);
      this.editing = false;
    },

    cancel() {
      this.editing = false;
    },

    ...mapActions("profiles", ["edit", "remove"])
  }
});

export default ProfileRow;
</script>
