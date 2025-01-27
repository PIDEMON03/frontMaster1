<script setup lang="ts">
import { ref, onBeforeMount, defineExpose, defineProps, watch } from 'vue';
import { BootstrapButtonEnum } from '@/types/BootstrapButtonEnum';
import { Parcours } from '@/domain/entities/Parcours';
import CustomInput from '@/presentation/components/forms/components/CustomInput.vue';
import CustomButton from '@/presentation/components/forms/components/CustomButton.vue';
import { ParcoursDAO } from '@/domain/daos/ParcoursDAO';
import CustomModal from '@/presentation/components/modals/CustomModal.vue';

// Calculer la plage dynamique basée sur l'année actuelle
const currentYear = new Date().getFullYear();
const minYear = currentYear - 20;
const maxYear = currentYear + 20;

const currentParcours = ref<Parcours>(new Parcours(null, null, null));
const isOpen = ref(false);
const emit = defineEmits(['refresh:parcours']);

const formErrors = ref<{
  NomParcours: string | null;
  AnneeFormation: string | null;
}>({
  NomParcours: null,
  AnneeFormation: null,
});

// Validation de NomParcours
watch(() => currentParcours.value.NomParcours, () => {
  if (!currentParcours.value.NomParcours || currentParcours.value.NomParcours.trim() === '' || currentParcours.value.NomParcours.length < 3) {
    formErrors.value.NomParcours = 'Le nom du parcours doit faire au moins 3 caractères';
  } else {
    formErrors.value.NomParcours = null;
  }
});

// Validation de AnneeFormation
watch(() => currentParcours.value.AnneeFormation, () => {
  const year = parseInt(currentParcours.value.AnneeFormation as any, 10);

  if (!currentParcours.value.AnneeFormation || isNaN(year)) {
    formErrors.value.AnneeFormation = 'L’année de formation doit être un nombre entier';
  } else if (year < minYear || year > maxYear) {
    formErrors.value.AnneeFormation = `L’année de formation doit être comprise entre ${minYear} et ${maxYear}`;
  } else {
    formErrors.value.AnneeFormation = null;
  }
});

// Gestion du formulaire
const openForm = (parcours: Parcours | null = null) => {
  isOpen.value = true;

  if (parcours) {
    currentParcours.value = parcours;
  }
};

const closeForm = () => {
  isOpen.value = false;
  currentParcours.value = new Parcours(null, null, null);
  formErrors.value = { NomParcours: null, AnneeFormation: null };
};

const props = defineProps({
  parcours: {
    type: Object as () => Parcours | null,
    required: false,
    default: null,
  },
});

onBeforeMount(() => {
  if (props.parcours) {
    currentParcours.value = props.parcours;
  }
});

const saveParcours = () => {
  // Vérification des erreurs avant de sauvegarder
  if (formErrors.value.NomParcours || formErrors.value.AnneeFormation) {
    alert('Veuillez corriger les erreurs dans le formulaire.');
    return;
  }

  const storedParcours = JSON.parse(localStorage.getItem('parcours') || '[]');

  if (currentParcours.value.ID) {
    // Mise à jour
    const index = storedParcours.findIndex((p: Parcours) => p.ID === currentParcours.value.ID);
    if (index !== -1) {
      storedParcours[index] = { ...currentParcours.value };
      localStorage.setItem('parcours', JSON.stringify(storedParcours));
      alert('Parcours mis à jour avec succès');
    }
  } else {
    // Création
    currentParcours.value.ID = Date.now();
    storedParcours.push({ ...currentParcours.value });
    localStorage.setItem('parcours', JSON.stringify(storedParcours));
    alert('Parcours créé avec succès');
  }

  emit('refresh:parcours'); // Émet un signal pour rafraîchir la table
  closeForm();
};

const deleteParcours = (id: number) => {
  const storedParcours = JSON.parse(localStorage.getItem('parcours') || '[]');
  const updatedParcours = storedParcours.filter((p: Parcours) => p.ID !== id);

  localStorage.setItem('parcours', JSON.stringify(updatedParcours));
  alert('Parcours supprimé avec succès');

  emit('refresh:parcours'); // Émet un signal pour rafraîchir la table
};

defineExpose({
  openForm,
  closeForm,
  deleteParcours,
});


</script>


<template>
  <CustomModal :isOpen="isOpen">
    <template v-slot:title>
      <template v-if="parcours && parcours.ID"> Modification du parcours </template>
      <template v-else> Nouveau parcours </template>
    </template>
    <template v-slot:body>
      <div class="text-start mt-1 mb-1">
        <form>
        <!-- Champ NomParcours -->
            <CustomInput
              v-model="currentParcours.NomParcours"
              id="intitule"
              libelle="Intitulé"
              type="text"
              placeholder="Intitulé du parcours"
              :error="formErrors.NomParcours"
            />
            <!-- Champ AnneeFormation -->
            <CustomInput
              class="mt-2"
              v-model="currentParcours.AnneeFormation"
              id="annee"
              libelle="Année"
              type="number"
              placeholder="Année de formation"
              :error="formErrors.AnneeFormation"
            />
          </form>
        </div>
        <CustomButton
          class="mt-1"
          style="margin-left: 5px"
          :color="BootstrapButtonEnum.danger"
          @click="closeForm"
        >
          Annuler
        </CustomButton>
        <CustomButton
          class="mt-1"
          style="margin-left: 5px"
          :color="BootstrapButtonEnum.primary"
          @click="saveParcours"
        >
          Enregistrer
        </CustomButton>
    </template>
  </CustomModal>
</template>



<style scoped>
.custom-modal {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  background-color: rgba(87, 86, 86, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.custom-modal .card {
  width: 250px;
}

.card-header {
  background: #273656;
  color: white;
  text-align: left;
}

.card-text {
  text-align: left;
}
</style>